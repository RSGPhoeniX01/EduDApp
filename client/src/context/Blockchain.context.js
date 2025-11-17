import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ethers } from 'ethers';

// 1. Paste your contract's deployed address
const contractAddress = "0x3fDA7d86F12B9C0633140Db13a7771f8BFd3e914"; 

// 2. Paste your contract's ABI
const contractABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "teacher",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "address",
      "name": "student",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "subject",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "mark",
      "type": "uint256"
    }
  ],
  "name": "MarkAdded",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "admin",
      "type": "address"
    }
  ],
  "name": "ResultsPublished",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "enum Education.Role",
      "name": "role",
      "type": "uint8"
    }
  ],
  "name": "UserApproved",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "enum Education.Role",
      "name": "role",
      "type": "uint8"
    }
  ],
  "name": "UserCreated",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "enum Education.Role",
      "name": "role",
      "type": "uint8"
    }
  ],
  "name": "UserRegistered",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_studentAddress",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "_subject",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_mark",
      "type": "uint256"
    }
  ],
  "name": "addMark",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "admin",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_userAddress",
      "type": "address"
    }
  ],
  "name": "approveUser",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "approvedStudents",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "approvedTeachers",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_userAddress",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    },
    {
      "internalType": "enum Education.Role",
      "name": "_role",
      "type": "uint8"
    },
    {
      "internalType": "string",
      "name": "_subject",
      "type": "string"
    },
    {
      "internalType": "string[]",
      "name": "_subjects",
      "type": "string[]"
    }
  ],
  "name": "createUser",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getApprovedStudents",
  "outputs": [
    {
      "components": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "enum Education.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "internalType": "enum Education.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "subject",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "subjects",
          "type": "string[]"
        }
      ],
      "internalType": "struct Education.User[]",
      "name": "",
      "type": "tuple[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getApprovedTeachers",
  "outputs": [
    {
      "components": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "enum Education.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "internalType": "enum Education.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "subject",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "subjects",
          "type": "string[]"
        }
      ],
      "internalType": "struct Education.User[]",
      "name": "",
      "type": "tuple[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getMyMarks",
  "outputs": [
    {
      "internalType": "string[]",
      "name": "",
      "type": "string[]"
    },
    {
      "internalType": "uint256[]",
      "name": "",
      "type": "uint256[]"
    },
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getMyRole",
  "outputs": [
    {
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "internalType": "enum Education.Role",
      "name": "role",
      "type": "uint8"
    },
    {
      "internalType": "enum Education.Status",
      "name": "status",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getMyStudents",
  "outputs": [
    {
      "components": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "enum Education.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "internalType": "enum Education.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "subject",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "subjects",
          "type": "string[]"
        }
      ],
      "internalType": "struct Education.User[]",
      "name": "",
      "type": "tuple[]"
    },
    {
      "internalType": "uint256[]",
      "name": "",
      "type": "uint256[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getPendingUsers",
  "outputs": [
    {
      "components": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "enum Education.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "internalType": "enum Education.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "subject",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "subjects",
          "type": "string[]"
        }
      ],
      "internalType": "struct Education.User[]",
      "name": "",
      "type": "tuple[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "name": "marks",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "pendingUsers",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "publishResults",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    },
    {
      "internalType": "enum Education.Role",
      "name": "_role",
      "type": "uint8"
    },
    {
      "internalType": "string",
      "name": "_subject",
      "type": "string"
    },
    {
      "internalType": "string[]",
      "name": "_subjects",
      "type": "string[]"
    }
  ],
  "name": "register",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "resultsPublished",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "users",
  "outputs": [
    {
      "internalType": "address",
      "name": "walletAddress",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "internalType": "enum Education.Role",
      "name": "role",
      "type": "uint8"
    },
    {
      "internalType": "enum Education.Status",
      "name": "status",
      "type": "uint8"
    },
    {
      "internalType": "string",
      "name": "subject",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [userStatus, setUserStatus] = useState(null); 
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  
  const roleEnum = { 0: 'NONE', 1: 'ADMIN', 2: 'TEACHER', 3: 'STUDENT' };
  const statusEnum = { 0: 'PENDING', 1: 'APPROVED' };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setCurrentAccount(account);
      await loadBlockchainData(account);

    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const loadBlockchainData = useCallback(async (account) => {
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const educationContract = new ethers.Contract(contractAddress, contractABI, signer);
      
      setContract(educationContract);

      const [name, role, status] = await educationContract.getMyRole();
      
      setUserName(name);
      setUserRole(roleEnum[Number(role)]);
      setUserStatus(statusEnum[Number(status)]);

    } catch (error)
    {
      
      console.log("Could not fetch role, user likely unregistered.");
      setUserRole('NONE'); 
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const account = accounts[0];
            setCurrentAccount(account);
            await loadBlockchainData(account);
          } else {
            setIsLoading(false); 
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); 
      }
    };
    
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          loadBlockchainData(accounts[0]); // Reload data for new account
        } else {
          setCurrentAccount(null);
          setUserRole(null);
          setUserStatus(null);
        }
      });
    }

  }, [loadBlockchainData]);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        contract,
        userRole,
        userStatus,
        userName,
        isLoading,
        roleEnum, 
        statusEnum
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => useContext(BlockchainContext);