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
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const ViewTeachers = () => {
  const { contract } = useBlockchain();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!contract) return;
      try {
        setIsLoading(true);
        const data = await contract.getApprovedTeachers();
        // FIX: Manually map struct properties to plain objects
        const formattedData = data.map(teacher => ({
          walletAddress: teacher.walletAddress,
          name: teacher.name,
          subject: teacher.subject
        }));
        setTeachers(formattedData);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, [contract]);

  if (isLoading) {
    return <Center p={10}><Spinner size="xl" /></Center>;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Approved Teachers
      </Heading>
      {teachers.length === 0 ? (
        <Text>No approved teachers found.</Text>
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Wallet Address</Th>
              <Th>Assigned Subject</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teachers.map((teacher) => (
              <Tr key={teacher.walletAddress}>
                <Td>{teacher.name}</Td>
                <Td>{teacher.walletAddress}</Td>
                <Td>{teacher.subject}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ViewTeachers;