import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const CreateUser = () => {
  const { contract, roleEnum } = useBlockchain();
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!contract) return;

    setIsLoading(true);
    try {
      const selectedRole = role === 'TEACHER' ? 2 : 3;
      const studentSubjects = subjects.split(',').map((s) => s.trim());

      const tx = await contract.createUser(
        address,
        name,
        selectedRole,
        subject,
        studentSubjects
      );
      await tx.wait();

      toast({
        title: 'User Created!',
        description: `${name} has been added and approved.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset form
      setAddress('');
      setName('');
      setSubject('');
      setSubjects('');
    } catch (error) {
      console.error('User creation failed:', error);
      toast({
        title: 'Creation Failed',
        description: error.message,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={6}>
        Manually Create & Approve User
      </Heading>
      <form onSubmit={handleCreate}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Wallet Address</FormLabel>
            <Input
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
            </Select>
          </FormControl>

          {role === 'TEACHER' && (
            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Input
                placeholder="e.g., Physics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </FormControl>
          )}

          {role === 'STUDENT' && (
            <FormControl isRequired>
              <FormLabel>Subjects</FormLabel>
              <Input
                placeholder="e.g., Physics, Chemistry"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </FormControl>
          )}

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            isLoading={isLoading}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          >
            Create User
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateUser;