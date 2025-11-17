import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Text,
  Alert,
  AlertIcon,
  VStack,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const TeacherDashboard = () => {
  const { contract, userName } = useBlockchain();
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [subject, setSubject] = useState('');
  const [resultsPublished, setResultsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState({}); 
  const toast = useToast();

  const fetchMyStudents = useCallback(async () => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const { subject: mySubject } = await contract.users(contract.runner.address);
      setSubject(mySubject);

      const [studentData, markData] = await contract.getMyStudents();
      const published = await contract.resultsPublished();
      setResultsPublished(published);

      const formattedStudents = studentData.map((student, index) => {

        return {
          walletAddress: student.walletAddress,
          name: student.name,
          subjects: student.subjects,
          initialMark: Number(markData[index]),
        };
      });

      setStudents(formattedStudents);

      // Initialize marks state
      const initialMarks = {};
      formattedStudents.forEach((student) => {
        initialMarks[student.walletAddress] = student.initialMark;
      });
      setMarks(initialMarks);

    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [contract, toast]);

  useEffect(() => {
    fetchMyStudents();
  }, [fetchMyStudents]);

  const handleMarkChange = (studentAddress, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentAddress]: value,
    }));
  };

  const handleSubmitMark = async (studentAddress) => {
    if (!contract) return;

    const mark = marks[studentAddress];

    if (mark < 0 || mark > 100) {
      toast({
        title: 'Invalid Mark',
        description: 'Mark must be between 0 and 100',
        status: 'warning',
      });
      return;
    }

    setSaveLoading((prev) => ({ ...prev, [studentAddress]: true }));
    try {
      const tx = await contract.addMark(studentAddress, subject, mark);
      await tx.wait();
      toast({
        title: 'Mark Updated!',
        status: 'success',
        duration: 3000,
      });
      
      fetchMyStudents();
    } catch (error) {
      console.error('Failed to update mark:', error);
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setSaveLoading((prev) => ({ ...prev, [studentAddress]: false }));
    }
  };

  if (isLoading) {
    return <Center p={10}><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={5} boxShadow="xl" borderRadius="lg">
      <VStack align="stretch" spacing={6}>
        <Heading>
          Welcome, {userName}!
        </Heading>
        <Heading size="lg">
          Your Subject: {subject}
        </Heading>

        {resultsPublished && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Results have been published. Marks are now read-only.
          </Alert>
        )}

        {students.length === 0 ? (
          <Text>No students are currently enrolled in your subject.</Text>
        ) : (
          <Box>
            <Heading size="md" mb={4}>
              Student Marks
            </Heading>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Student Name</Th>
                  <Th>Wallet Address</Th>
                  <Th>Mark (out of 100)</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.map((student) => {
                  const currentMark = marks[student.walletAddress];
                  const isSaved = Number(currentMark) === Number(student.initialMark);
                  return (
                    <Tr key={student.walletAddress}>
                      <Td>{student.name}</Td>
                      <Td>{student.walletAddress}</Td>
                      <Td>
                        <Input
                          type="number"
                          value={currentMark || ''}
                          onChange={(e) =>
                            handleMarkChange(student.walletAddress, e.target.value)
                          }
                          isDisabled={resultsPublished}
                          width="100px"
                        />
                      </Td>
                      <Td>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          onClick={() => handleSubmitMark(student.walletAddress)}
                          isDisabled={resultsPublished || isSaved || saveLoading[student.walletAddress]}
                          isLoading={saveLoading[student.walletAddress]}
                        >
                          Save
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default TeacherDashboard;