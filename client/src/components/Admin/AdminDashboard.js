import React, { useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useBlockchain } from '../../context/Blockchain.context';
import ApproveUsers from './ApproveUser';
import CreateUser from './CreateUser';
import ViewTeachers from './ViewTeachers';
import ViewStudents from './ViewStudents';

const AdminDashboard = () => {
  const { contract } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handlePublishResults = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.publishResults();
      await tx.wait();
      toast({
        title: 'Results Published!',
        description: 'Students can now see their marks, and teachers can no longer edit them.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to publish results:', error);
      toast({
        title: 'Error Publishing Results',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6} color="brand.800">
        Admin Dashboard
      </Heading>
      
      <Tabs variant="enclosed-colored" colorScheme="teal">
        <TabList>
          <Tab _selected={{ color: 'black', bg: 'teal.300' }}>Approve Users</Tab>
          <Tab _selected={{ color: 'black', bg: 'teal.300' }}>Create User</Tab>
          <Tab _selected={{ color: 'black', bg: 'teal.300' }}>View Teachers</Tab>
          <Tab _selected={{ color: 'black', bg: 'teal.300' }}>View Students</Tab>
          <Tab _selected={{ color: 'black', bg: 'teal.300' }}>Operations</Tab>
        </TabList>

        <TabPanels boxShadow="md" borderRadius="0 0 lg lg">
          <TabPanel>
            <ApproveUsers />
          </TabPanel>
          <TabPanel>
            <CreateUser />
          </TabPanel>
          <TabPanel>
            <ViewTeachers />
          </TabPanel>
          <TabPanel>
            <ViewStudents />
          </TabPanel>
          <TabPanel>
            <Heading size="md" mb={4}>Result Operations</Heading>
            <Button
              colorScheme="red"
              onClick={handlePublishResults}
              isLoading={isLoading}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              Publish All Results
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;