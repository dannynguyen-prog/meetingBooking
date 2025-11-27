'use client';

import { Box, Button, Heading, SimpleGrid, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { DashboardStats } from '../../src/components/DashboardStats';
import { CompanyTable } from '../../src/components/CompanyTable';
import {
  useCompanies,
  useCreateCompany,
  useMeetings,
  useMeetingRooms
} from '../../src/hooks/useAdminDashboard';
import { CreateCompanyDrawer } from '../../src/components/CreateCompanyDrawer';
import { MeetingTimeline } from '../../src/components/MeetingTimeline';
import api, { endpoints } from '../../src/lib/api-client';

export default function DashboardPage() {
  const toast = useToast();
  const { data: companies = [] } = useCompanies();
  const { data: rooms = [] } = useMeetingRooms();
  const { data: meetings = [] } = useMeetings();
  const createCompanyDrawer = useDisclosure();
  const createCompany = useCreateCompany();

  const stats = [
    { label: 'Companies', value: companies.length },
    { label: 'Meeting rooms', value: rooms.length },
    { label: 'Upcoming meetings', value: meetings.length }
  ];

  const handleInviteAdmin = async (companyId: string) => {
    try {
      await api.post(endpoints.companies + `/${companyId}/admins/invite`);
      toast({ title: 'Invitation sent', status: 'success' });
    } catch (error: any) {
      toast({
        title: 'Unable to send invitation',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    }
  };

  const handleToggleCompanyStatus = async (companyId: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      await api.patch(`${endpoints.companies}/${companyId}`, { status });
      toast({ title: 'Company updated', status: 'success' });
    } catch (error: any) {
      toast({
        title: 'Unable to update company',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    }
  };

  return (
    <Stack spacing={8}>
      <SimpleGrid columns={{ base: 1, xl: 4 }} gap={6}>
        <DashboardStats items={stats} />
      </SimpleGrid>

      <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.100">
        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" mb={4}>
          <Heading size="md">Companies</Heading>
          <Button onClick={createCompanyDrawer.onOpen} colorScheme="brand">
            Create company
          </Button>
        </Stack>
        <CompanyTable
          companies={companies}
          onInviteAdmin={handleInviteAdmin}
          onToggleStatus={handleToggleCompanyStatus}
        />
      </Box>

      <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.100">
        <Heading size="md" mb={4}>
          Upcoming meetings
        </Heading>
        <MeetingTimeline meetings={meetings} />
      </Box>

      <CreateCompanyDrawer
        isOpen={createCompanyDrawer.isOpen}
        onClose={createCompanyDrawer.onClose}
        onSubmit={(payload) =>
          createCompany.mutate(payload, { onSuccess: createCompanyDrawer.onClose })
        }
        isLoading={createCompany.isPending}
      />
    </Stack>
  );
}
