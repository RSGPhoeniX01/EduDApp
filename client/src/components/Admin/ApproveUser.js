import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const ApproveUsers = () => {
  const { contract, roleEnum } = useBlockchain();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchPendingUsers = async () => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const users = await contract.getPendingUsers();
      // Convert BigInt to Number for role
      const formattedUsers = users.map(user => ({
        // FIX: Manually map struct properties
        walletAddress: user.walletAddress,
        name: user.name,
        role: roleEnum[Number(user.role)]
      }));
      setPendingUsers(formattedUsers);
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, [contract]);

  const handleApprove = async (userAddress) => {
    if (!contract) return;
    try {
      const tx = await contract.approveUser(userAddress);
      await tx.wait();
      toast({
        title: 'User Approved!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refresh the list
      fetchPendingUsers();
    } catch (error) {
      console.error('Failed to approve user:', error);
      toast({ title: 'Error', description: error.message, status: 'error' });
    }
  };

  if (isLoading) {
    return <Center p={10}><Spinner size="xl" /></Center>;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Pending User Registrations
      </Heading>
      {pendingUsers.length === 0 ? (
        <Text>No pending users found.</Text>
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Wallet Address</Th>
              <Th>Role</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pendingUsers.map((user) => (
              <Tr key={user.walletAddress}>
                <Td>{user.name}</Td>
                <Td>{user.walletAddress}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => handleApprove(user.walletAddress)}
                  >
                    Approve
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ApproveUsers;