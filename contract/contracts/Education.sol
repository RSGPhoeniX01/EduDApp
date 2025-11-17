// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "hardhat/console.sol";

contract Education {
    address public admin;

    enum Role { NONE, ADMIN, TEACHER, STUDENT }
    enum Status { PENDING, APPROVED }

    struct User {
        address walletAddress;
        string name; 
        Role role;
        Status status;
        string subject; 
        string[] subjects;
    }

    mapping(address => User) public users;

    address[] public pendingUsers;
    address[] public approvedTeachers;
    address[] public approvedStudents;

    mapping(address => mapping(string => uint)) public marks;

    bool public resultsPublished;

    // Events
    event UserRegistered(address user, string name, Role role);
    event UserApproved(address user, Role role);
    event UserCreated(address user, string name, Role role);
    event MarkAdded(address teacher, address student, string subject, uint mark);
    event ResultsPublished(address admin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyTeacher() {
        require(users[msg.sender].role == Role.TEACHER, "Only teachers can call this function");
        require(users[msg.sender].status == Status.APPROVED, "Teacher not approved");
        _;
    }

    modifier resultsNotPublished() {
        require(!resultsPublished, "Results are already published");
        _;
    }

    constructor() {
        admin = msg.sender;
        users[admin] = User({
            walletAddress: admin,
            name: "Admin",
            role: Role.ADMIN,
            status: Status.APPROVED,
            subject: "",
            subjects: new string[](0)
        });
        emit UserCreated(admin, "Admin", Role.ADMIN);
    }

    function getMyRole() public view returns (string memory name, Role role, Status status) {
        User storage user = users[msg.sender];
        return (user.name, user.role, user.status);
    }

    function register(string memory _name, Role _role, string memory _subject, string[] memory _subjects) public {
        require(users[msg.sender].role == Role.NONE, "User already registered");
        require(_role == Role.TEACHER || _role == Role.STUDENT, "Can only register as Teacher or Student");

        User storage newUser = users[msg.sender];
        newUser.walletAddress = msg.sender;
        newUser.name = _name;
        newUser.role = _role;
        newUser.status = Status.PENDING;

        if (_role == Role.TEACHER) {
            newUser.subject = _subject;
        } else {
            newUser.subjects = _subjects;
        }

        pendingUsers.push(msg.sender);
        emit UserRegistered(msg.sender, _name, _role);
    }

    function approveUser(address _userAddress) public onlyAdmin {
        User storage user = users[_userAddress];
        require(user.status == Status.PENDING, "User is not pending");

        user.status = Status.APPROVED;

        // Add to the correct approved list
        if (user.role == Role.TEACHER) {
            approvedTeachers.push(_userAddress);
        } else if (user.role == Role.STUDENT) {
            approvedStudents.push(_userAddress);
        }

        // Remove from pendingUsers array
        _removePendingUser(_userAddress);

        emit UserApproved(_userAddress, user.role);
    }

  
    function createUser(address _userAddress, string memory _name, Role _role, string memory _subject, string[] memory _subjects) public onlyAdmin {
        require(users[_userAddress].role == Role.NONE, "User already exists");
        require(_role == Role.TEACHER || _role == Role.STUDENT, "Can only create Teacher or Student");

        User storage newUser = users[_userAddress];
        newUser.walletAddress = _userAddress;
        newUser.name = _name;
        newUser.role = _role;
        newUser.status = Status.APPROVED;

        if (_role == Role.TEACHER) {
            newUser.subject = _subject;
            approvedTeachers.push(_userAddress);
        } else {
            newUser.subjects = _subjects;
            approvedStudents.push(_userAddress);
        }

        emit UserCreated(_userAddress, _name, _role);
    }

    function addMark(address _studentAddress, string memory _subject, uint _mark) public onlyTeacher resultsNotPublished {
        // Check if the teacher is assigned to this subject
        require(keccak256(abi.encodePacked(users[msg.sender].subject)) == keccak256(abi.encodePacked(_subject)), "Teacher not assigned to this subject");
        
        // Check if the student is enrolled in this subject
        string[] storage studentSubjects = users[_studentAddress].subjects;
        bool isEnrolled = false;
        for (uint i = 0; i < studentSubjects.length; i++) {
            if (keccak256(abi.encodePacked(studentSubjects[i])) == keccak256(abi.encodePacked(_subject))) {
                isEnrolled = true;
                break;
            }
        }
        require(isEnrolled, "Student not enrolled in this subject");

        marks[_studentAddress][_subject] = _mark;
        emit MarkAdded(msg.sender, _studentAddress, _subject, _mark);
    }

 
    function publishResults() public onlyAdmin {
        resultsPublished = true;
        emit ResultsPublished(msg.sender);
    }


    function getPendingUsers() public view onlyAdmin returns (User[] memory) {
        User[] memory pendingList = new User[](pendingUsers.length);
        for (uint i = 0; i < pendingUsers.length; i++) {
            pendingList[i] = users[pendingUsers[i]];
        }
        return pendingList;
    }

    function getApprovedTeachers() public view onlyAdmin returns (User[] memory) {
        User[] memory teacherList = new User[](approvedTeachers.length);
        for (uint i = 0; i < approvedTeachers.length; i++) {
            teacherList[i] = users[approvedTeachers[i]];
        }
        return teacherList;
    }

    function getApprovedStudents() public view onlyAdmin returns (User[] memory) {
        User[] memory studentList = new User[](approvedStudents.length);
        for (uint i = 0; i < approvedStudents.length; i++) {
            studentList[i] = users[approvedStudents[i]];
        }
        return studentList;
    }

    function getMyStudents() public view onlyTeacher returns (User[] memory, uint[] memory) {
        string memory mySubject = users[msg.sender].subject;
        
        uint studentCount = 0;
        for(uint i = 0; i < approvedStudents.length; i++) {
            address studentAddress = approvedStudents[i];
            string[] storage studentSubjects = users[studentAddress].subjects;
            for (uint j = 0; j < studentSubjects.length; j++) {
                if(keccak256(abi.encodePacked(studentSubjects[j])) == keccak256(abi.encodePacked(mySubject))) {
                    studentCount++;
                    break;
                }
            }
        }

        User[] memory studentList = new User[](studentCount);
        uint[] memory studentMarks = new uint[](studentCount);
        uint k = 0;
        for(uint i = 0; i < approvedStudents.length; i++) {
            address studentAddress = approvedStudents[i];
            string[] storage studentSubjects = users[studentAddress].subjects;
            for (uint j = 0; j < studentSubjects.length; j++) {
                if(keccak256(abi.encodePacked(studentSubjects[j])) == keccak256(abi.encodePacked(mySubject))) {
                    studentList[k] = users[studentAddress];
                    studentMarks[k] = marks[studentAddress][mySubject];
                    k++;
                    break;
                }
            }
        }
        return (studentList, studentMarks);
    }

    function getMyMarks() public view returns (string[] memory, uint[] memory, bool) {
        require(users[msg.sender].role == Role.STUDENT, "Only students can call this");
        
        User storage student = users[msg.sender];
        string[] memory mySubjects = student.subjects;
        uint[] memory myMarks = new uint[](mySubjects.length);

        for (uint i = 0; i < mySubjects.length; i++) {
            myMarks[i] = marks[msg.sender][mySubjects[i]];
        }

        return (mySubjects, myMarks, resultsPublished);
    }

    function _removePendingUser(address _userAddress) internal {
        for (uint i = 0; i < pendingUsers.length; i++) {
            if (pendingUsers[i] == _userAddress) {
                // Shift elements left
                for (uint j = i; j < pendingUsers.length - 1; j++) {
                    pendingUsers[j] = pendingUsers[j + 1];
                }
                pendingUsers.pop(); 
                return;
            }
        }
    }
}