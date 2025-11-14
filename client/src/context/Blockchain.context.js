import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ethers } from 'ethers';

// --- IMPORTANT ---
// 1. Paste your contract's deployed address
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE"; 

// 2. Paste your contract's ABI
const contractABI = [ /* YOUR_CONTRACT_ABI_HERE */ ];
// --- IMPORTANT ---

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'NONE', 'ADMIN', 'TEACHER', 'STUDENT'
  const [userStatus, setUserStatus] = useState(null); // 'PENDING', 'APPROVED'
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Enum mappings from Solidity
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

  // --- FIX 1: Wrap loadBlockchainData in useCallback ---
  const loadBlockchainData = useCallback(async (account) => {
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);
      const educationContract = new ethers.Contract(contractAddress, contractABI, signer);
      
      setContract(educationContract);

      // Fetch the user's role and status
      const [name, role, status] = await educationContract.getMyRole();
      
      setUserName(name);
      setUserRole(roleEnum[Number(role)]);
      setUserStatus(statusEnum[Number(status)]);

    } catch (error)
    {
      // If getMyRole fails, it's likely an unregistered user or network issue
      console.log("Could not fetch role, user likely unregistered.");
      setUserRole('NONE'); // Default to 'NONE' if role call fails
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as it has no external dependencies

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
            setIsLoading(false); // No account connected
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // No MetaMask
      }
    };
    
    checkWalletConnection();

    // Listen for account changes
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

    // --- FIX 2: Add loadBlockchainData to dependency array ---
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
        roleEnum, // Pass enums for use in forms
        statusEnum
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook to use the context
export const useBlockchain = () => useContext(BlockchainContext);