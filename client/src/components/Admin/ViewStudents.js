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
  Tag,
  HStack,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const ViewStudents = () => {
  const { contract } = useBlockchain();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!contract) return;
      try {
        setIsLoading(true);
        const data = await contract.getApprovedStudents();
        const formattedData = data.map(student => ({
          walletAddress: student.walletAddress,
          name: student.name,
          subjects: student.subjects
        }));
        setStudents(formattedData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [contract]);

  if (isLoading) {
    return <Center p={10}><Spinner size="xl" /></Center>;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Approved Students
      </Heading>
      {students.length === 0 ? (
        <Text>No approved students found.</Text>
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Wallet Address</Th>
              <Th>Enrolled Subjects</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student.walletAddress}>
                <Td>{student.name}</Td>
                <Td>{student.walletAddress}</Td>
                <Td>
                  <HStack spacing={2}>
                    {student.subjects.map((sub, index) => (
                      <Tag key={index} colorScheme="teal">
                        {sub}
                      </Tag>
                    ))}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ViewStudents;