'use client';

import { Box, Button, Heading, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { EmployeeTable } from '../../../src/components/EmployeeTable';
import { InviteEmployeeDrawer } from '../../../src/components/InviteEmployeeDrawer';
import { useEmployees } from '../../../src/hooks/useAdminDashboard';
import api, { endpoints } from '../../../src/lib/api-client';
import { useState } from 'react';

export default function EmployeesPage() {
  const { data: employees = [], refetch } = useEmployees();
  const inviteDrawer = useDisclosure();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async ({ email }: { email: string }) => {
    setIsSubmitting(true);
    try {
      await api.post('/employees/invite', { email });
      toast({ title: 'Invitation sent', status: 'success' });
      inviteDrawer.onClose();
    } catch (error: any) {
      toast({
        title: 'Unable to invite employee',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (employeeId: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      await api.patch(`${endpoints.employees}/${employeeId}/status`, { status });
      toast({ title: 'Employee updated', status: 'success' });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Unable to update employee',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    }
  };

  return (
    <Stack spacing={6}>
      <Box bg="white" p={6} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          mb={4}
        >
          <Heading size="md">Employees</Heading>
          <Button colorScheme="brand" onClick={inviteDrawer.onOpen}>
            Invite employee
          </Button>
        </Stack>
        <EmployeeTable employees={employees} onToggleStatus={handleToggleStatus} />
      </Box>
      <InviteEmployeeDrawer
        isOpen={inviteDrawer.isOpen}
        onClose={inviteDrawer.onClose}
        onSubmit={handleInvite}
        isLoading={isSubmitting}
      />
    </Stack>
  );
}
