import React from 'react';
import { Box, Button, Heading, Text, VStack, Container } from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';
import { FaWallet } from 'react-icons/fa';

const Home = () => {
  const { connectWallet } = useBlockchain();

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
        <Heading as="h1" size="2xl">
          Welcome to EduChain
        </Heading>
        <Text fontSize="xl">
          A decentralized education platform. Please connect your MetaMask
          wallet to begin.
        </Text>
        <Button
          onClick={connectWallet}
          leftIcon={<FaWallet />}
          colorScheme="teal"
          size="lg"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          animation="pulse 1.5s infinite"
        >
          Connect Wallet
        </Button>
      </VStack>
    </Container>
  );
};

export default Home;