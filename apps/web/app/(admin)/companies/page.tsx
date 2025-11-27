'use client';

import { Box, Button, Heading, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { CompanyTable } from '../../../src/components/CompanyTable';
import { CreateCompanyDrawer } from '../../../src/components/CreateCompanyDrawer';
import { useCompanies, useCreateCompany } from '../../../src/hooks/useAdminDashboard';
import api, { endpoints } from '../../../src/lib/api-client';

export default function CompaniesPage() {
  const { data: companies = [] } = useCompanies();
  const createCompanyDrawer = useDisclosure();
  const toast = useToast();
  const createCompany = useCreateCompany();

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
    <Stack spacing={6}>
      <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.100">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          mb={4}
        >
          <Heading size="md">Companies</Heading>
          <Button colorScheme="brand" onClick={createCompanyDrawer.onOpen}>
            Create company
          </Button>
        </Stack>
        <CompanyTable
          companies={companies}
          onInviteAdmin={handleInviteAdmin}
          onToggleStatus={handleToggleCompanyStatus}
        />
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
