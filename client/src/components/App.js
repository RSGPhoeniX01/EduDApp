import React from 'react';
import { Box, Spinner, Center, Heading } from '@chakra-ui/react';
import { useBlockchain } from '../context/Blockchain.context';

// Import components
import Navigation from './common/Navigation';
import Home from './common/Home';
import Register from './common/Register';
import Waiting from './common/Waiting';
import AdminDashboard from './Admin/AdminDashboard';
import TeacherDashboard from './Teacher/TeacherDashboard';
import StudentDashboard from './Student/StudentDashboard';

function App() {
  const { currentAccount, userRole, userStatus, isLoading } = useBlockchain();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center minH="80vh">
          <Spinner size="xl" />
        </Center>
      );
    }

    if (!currentAccount) {
      return <Home />;
    }

    if (userRole === 'NONE') {
      return <Register />;
    }

    if (userStatus === 'PENDING') {
      return <Waiting />;
    }

    if (userStatus === 'APPROVED') {
      switch (userRole) {
        case 'ADMIN':
          return <AdminDashboard />;
        case 'TEACHER':
          return <TeacherDashboard />;
        case 'STUDENT':
          return <StudentDashboard />;
        default:
          return <Heading>Unknown role...</Heading>;
      }
    }

    return <Heading>An unexpected error occurred.</Heading>;
  };

  return (
    <Box>
      <Navigation />
      <Box p={8}>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;