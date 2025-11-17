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
  Container,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';

const Register = () => {
  const { contract, roleEnum } = useBlockchain();
  const [name, setName] = useState('');
  const [role, setRole] = useState(roleEnum[2]); 
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!contract) return;

    setIsLoading(true);
    try {
      // RoleEnum 2 = TEACHER, 3 = STUDENT
      const selectedRole = role === 'TEACHER' ? 2 : 3;
      const studentSubjects = subjects.split(',').map((s) => s.trim());
      
      const tx = await contract.register(
        name,
        selectedRole,
        subject,
        studentSubjects
      );
      await tx.wait();

      toast({
        title: 'Registration Submitted!',
        description: 'Your registration is pending admin approval. Please wait.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      window.location.reload(); 
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md">
      <Box p={8} boxShadow="xl" borderRadius="lg">
        <Heading mb={6} textAlign="center" color="brand.800">
          Register Your Account
        </Heading>
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="John Doe"
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
                  placeholder="e.g., Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </FormControl>
            )}

            {role === 'STUDENT' && (
              <FormControl isRequired>
                <FormLabel>Subjects</FormLabel>
                <Input
                  placeholder="e.g., Mathematics, History, Science"
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
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default Register;