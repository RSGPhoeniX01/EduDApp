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
  const { contract, userName } = useBlockchain();
  const [myMarks, setMyMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [cpi, setCpi] = useState(null);
  const [backs, setBacks] = useState([]);

  const getGrade = (mark) => {
    if (mark >= 85) return "A+";
    if (mark >= 75) return "A";
    if (mark >= 65) return "B+";
    if (mark >= 55) return "B";
    if (mark >= 45) return "C";
    if (mark >= 35) return "D";
    return "F";
  };

  const gradeToPoint = (grade) => {
    switch (grade) {
      case "A+": return 10;
      case "A": return 9;
      case "B+": return 8;
      case "B": return 7;
      case "C": return 6;
      case "D": return 5;
      default: return 4;  // F
    }
  };

  useEffect(() => {
    const fetchMyMarks = async () => {
      if (!contract) return;
      try {
        setIsLoading(true);

        const [subjects, marks, resultsPublished_bool] = await contract.getMyMarks();
        setIsPublished(resultsPublished_bool);

        const formattedData = subjects.map((subject, index) => {
          const mark = Number(marks[index]);
          const grade = getGrade(mark);
          return { subject, mark, grade };
        });

        setMyMarks(formattedData);

        if (resultsPublished_bool) {
          let totalPoints = 0;
          let backSubs = [];

          formattedData.forEach((item) => {
            totalPoints += gradeToPoint(item.grade);
            if (item.grade === "F") backSubs.push(item.subject);
          });

          setBacks(backSubs);
          setCpi((totalPoints / formattedData.length).toFixed(2));
        }

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
        <Heading>Welcome, {userName}!</Heading>

        {!isPublished && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Results are not yet published.
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
                <Th>Grade</Th>
              </Tr>
            </Thead>
            <Tbody>
              {myMarks.map((item) => (
                <Tr key={item.subject}>
                  <Td>{item.subject}</Td>
                  <Td>
                    {isPublished ? (
                      <Text fontWeight="bold">{item.mark}</Text>
                    ) : (
                      <Text color="gray.500">Not Published</Text>
                    )}
                  </Td>
                  <Td>
                    {isPublished ? (
                      <Text fontWeight="bold">{item.grade}</Text>
                    ) : (
                      <Text color="gray.500">-</Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {isPublished && (
          <>
            <Heading size="md">Result Summary</Heading>

            <Text fontSize="lg" fontWeight="bold">
              CPI: {cpi}
            </Text>

            {backs.length > 0 ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                Back in: {backs.join(", ")}
              </Alert>
            ) : (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                Congratulations! You have passed all subjects.
              </Alert>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default StudentDashboard;
