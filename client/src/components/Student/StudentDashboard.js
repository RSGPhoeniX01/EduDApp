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
  Alert,
  AlertIcon,
  VStack,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const StudentDashboard = () => {
  const { contract, name } = useBlockchain(); // <-- FIX: Use 'name'
  const [myMarks, setMyMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false); // <-- FIX: Add local state for published status

  useEffect(() => {
    const fetchMyMarks = async () => {
      if (!contract) return;
      try {
        setIsLoading(true);
        // FIX: getMyMarks() returns (subjects, marks, resultsPublished_bool)
        const [subjects, marks, resultsPublished_bool] = await contract.getMyMarks();

        // FIX: Update local published status
        setIsPublished(resultsPublished_bool); 

        const formattedData = subjects.map((subject, index) => ({
          subject: subject,
          mark: Number(marks[index]),
        }));
        setMyMarks(formattedData);
      } catch (error) {
        console.error('Failed to fetch marks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyMarks();
  }, [contract]);

  if (isLoading) {
    return <Center p={10}><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={5} boxShadow="xl" borderRadius="lg">
      <VStack align="stretch" spacing={6}>
        <Heading>
          Welcome, {name}! {/* <-- FIX: Use 'name' */}
        </Heading>

        {!isPublished && ( /* <-- FIX: Use local 'isPublished' */
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Results are not yet published. Your marks will appear here once the
            admin has released them.
          </Alert>
        )}

        <Heading size="lg">Your Enrolled Subjects</Heading>
        {myMarks.length === 0 ? (
          <Text>You are not enrolled in any subjects.</Text>
        ) : (
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Subject</Th>
                <Th>Mark (out of 100)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {myMarks.map((item) => (
                <Tr key={item.subject}>
                  <Td>{item.subject}</Td>
                  <Td>
                    {isPublished ? ( /* <-- FIX: Use local 'isPublished' */
                      <Text fontWeight="bold">{item.mark}</Text>
                    ) : (
                      <Text color="gray.500">Not Published</Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  );
};

export default StudentDashboard;