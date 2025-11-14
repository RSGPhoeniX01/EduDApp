import React from 'react';
import { Box, Heading, Text, VStack, Container, Spinner } from '@chakra-ui/react';

const Waiting = () => {
  return (
    <Container maxW="container.md" centerContent>
      <VStack
        spacing={8}
        mt={20}
        p={10}
        boxShadow="xl"
        borderRadius="lg"
        textAlign="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
        <Heading as="h1" size="xl">
          Pending Approval
        </Heading>
        <Text fontSize="lg">
          Your account registration has been submitted and is
          waiting for admin approval.
        </Text>
        <Text fontSize="md" color="gray.400">
          Please check back later. This page will update automatically
          once you are approved.
        </Text>
      </VStack>
    </Container>
  );
};

export default Waiting;