import React from 'react';
import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';
import { FaWallet } from 'react-icons/fa';

const Navigation = () => {
  const { currentAccount, connectWallet, userName, userRole } = useBlockchain();
  console.log("role",userRole);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getRoleName = (userRole) => {
    switch (userRole) {
      case 'ADMIN': return 'ADMIN';
      case 'TEACHER': return 'TEACHER';
      case 'STUDENT': return 'STUDENT';
      case 'PENDING': return 'PENDING';
      default: return '...';
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="brand.800"
      color="white"
      boxShadow="md"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
          EduChain
        </Heading>
      </Flex>

      <Box>
        {currentAccount ? (
          <Flex align="center">
            <Text mr={4} fontWeight="bold">
              {userName} ({getRoleName(userRole)}) 
              
            </Text>
            <Button
              bg="whiteAlpha.300"
              color="white"
              _hover={{ bg: 'whiteAlpha.400' }}
            >
              {truncateAddress(currentAccount)}
            </Button>
          </Flex>
        ) : (
          <Button
            onClick={connectWallet}
            leftIcon={<FaWallet />}
            colorScheme="teal"
            variant="solid"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default Navigation;