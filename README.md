EduDApp: Blockchain Education Management System

EduDApp is a decentralized application (DApp) that demonstrates a tamper-proof, role-based system for managing an educational institution. The project features three distinct user roles—Admin, Teacher, and Student—all authenticated via their MetaMask wallet address.

All data, including user roles, subjects, and student marks, is stored 100% on-chain in a Solidity smart contract, ensuring complete transparency and immutability.

Tech Stack

Frontend: React, Chakra UI, Ethers.js

Backend: Solidity

Development Framework: Hardhat

Local Blockchain: ganache-cli

Wallet: MetaMask

Key Features

Role-Based Access Control: Secure authentication via MetaMask. The UI and available actions are unique to each role.

On-Chain Registration: New users register as a Teacher or Student and enter a "Pending" state. The Admin must approve them before they can access their dashboard.

Immutable Mark Entry: Teachers can add and update marks for their students. The Admin can "Publish" these results, which permanently locks them from further edits.

Transparent Results: Students can only view their marks after the Admin has published the results.

Direct Admin Control: The Admin can bypass the registration queue and create new users (Teachers or Students) directly.

System Flow

The primary flow is based on a user's status in the smart contract:

New User: Connects wallet -> Sees "Register" page.

Pending User: Has registered but not been approved -> Sees "Waiting for Approval" page.

Approved User: Has been approved by Admin -> Sees their role-specific Dashboard (Admin, Teacher, or Student).

How to Run This Project

Follow these steps exactly to get the project running locally.

Prerequisites

Node.js (v18+): Download here

MetaMask extension in your browser: Download here

ganache-cli: Install it globally by opening your terminal and running:

npm install -g ganache-cli


Part 1: Backend & Smart Contract Setup (Terminal 1)

This section sets up your local blockchain and deploys the smart contract.

Open your first terminal.

Start Ganache: Run the following command to start your local blockchain.

ganache-cli


Copy the Admin Private Key: Ganache will output a list of accounts. Copy the first (0) Private Key. This will be your Admin wallet. Keep this terminal running.

Open a second terminal.

Navigate to the contract folder:

cd path/to/your/project/contracts


Install dependencies:

npm install


Configure Admin Wallet: Open the contracts/hardhat.config.js file in your code editor.

Find the accounts array.

Paste the Private Key you copied from Ganache.

// hardhat.config.js
...
networks: {
  ganache: {
    url: "[http://127.0.0.1:8545](http://127.0.0.1:8545)",
    accounts: ["YOUR_GANACHE_PRIVATE_KEY_HERE"] // <-- PASTE HERE
  },
},
...


Compile the Contract:

npx hardhat compile


Deploy the Contract:

npx hardhat run scripts/deploy.js --network ganache


The terminal will output: Education contract deployed to: 0x.... Copy this address.

Part 2: Frontend & React App Setup (Terminal 3)

This section connects your React app to the deployed contract.

Open a third terminal.

Navigate to the client folder:

cd path/to/your/project/client


Install dependencies:

npm install


Configure the Frontend: Open the client/src/context/Blockchain.context.js file. You need to paste the Address and ABI here.

A. Paste the Contract Address:
Paste the address you copied from Step 9 (Part 1).

// client/src/context/Blockchain.context.js
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE"; // <-- PASTE ADDRESS HERE


B. Paste the Contract ABI (The "Step 3" You Asked About):

Go back to your contracts folder.

Navigate to artifacts/contracts/Education.sol/Education.json.

Open this Education.json file.

Find the key named "abi":.

Copy the entire array that starts with [ and ends with ].

Paste this entire array into the contractABI variable in Blockchain.context.js.

// client/src/context/Blockchain.context.js

// ...your address from above...

const contractABI = [ // <-- PASTE THE ENTIRE ABI ARRAY HERE
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  // ... MANY MORE LINES ...
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [ /* ... */ ],
    "stateMutability": "view",
    "type": "function"
  }
];


Start the React App:

npm start


Your app is now running! It will open in your browser at http://localhost:3000.

How to Use the Application

Now that the app is running, here is how to test the full workflow.

Step 1: Set Up MetaMask

Open your MetaMask extension.

Click the network dropdown at the top and select Localhost 8545. (If you don't see it, go to "Add Network" and add it manually).

Click your account icon > "Import account".

Paste the Admin's Private Key (the one you copied from Ganache in Part 1).

Step 2: The Admin Flow

Go to http://localhost:3000.

Click the "Connect Wallet" button in the navigation bar.

The app will recognize you as the Admin (since you imported the Admin wallet).

You will be automatically redirected to the Admin Dashboard.

Explore the tabs: "Create User", "View Teachers", etc. They will be empty for now.

Step 3: The Student/Teacher Registration Flow

In MetaMask, click the account icon and select Account 2 (any other account from Ganache).

The website will refresh. Since this new account is not registered, you will see the Registration Page.

Fill out the form:

Name: Test Teacher

Role: Teacher

Subject: Computer Science

Click "Register". Your transaction will be sent to MetaMask. Confirm it.

After the transaction, you will be redirected to the "Waiting for Approval" page.

Step 4: The Approval Flow (Admin)

In MetaMask, switch back to your Admin account (Account 1).

The page will refresh to your Admin Dashboard.

Go to the "Approve Users" tab.

You will now see "Test Teacher" in the list.

Click the "Approve" button and confirm the MetaMask transaction.

The user will disappear from the pending list.

Step 5: The Teacher Flow (Post-Approval)

In MetaMask, switch back to the Teacher's account (Account 2).

The page will refresh, and you will now see the Teacher Dashboard.

You can see a list of students (it will be empty).

(Repeat Steps 3 & 4 to register and approve a Student.)

As the Admin, go to "Create User" or "View Teachers" to manage users.

As the Teacher, you can now go to your dashboard and add marks for your approved students.

Step 6: The Results Flow (Admin & Student)

As the Teacher, add marks for a student (e.g., 85).

As the Student, log in. You will see your subjects but no marks.

As the Admin, go to the "Operations" tab.

Click the "Publish Results" button and confirm the transaction.

As the Teacher, log in. You will see the marks are now locked and disabled.

As the Student, log in again. You will now be able to see your mark: 85.

License

This project is licensed under the MIT License. See the LICENSE file for details.