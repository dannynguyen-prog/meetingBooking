import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { FiRepeat, FiUsers } from 'react-icons/fi';

type Company = {
  id: string;
  name: string;
  industry?: string;
  status: 'ACTIVE' | 'INACTIVE';
  admins?: { id: string; email: string; status: string }[];
};

type CompanyTableProps = {
  companies: Company[];
  onInviteAdmin: (companyId: string) => void;
  onToggleStatus: (companyId: string, status: 'ACTIVE' | 'INACTIVE') => void;
};

export function CompanyTable({ companies, onInviteAdmin, onToggleStatus }: CompanyTableProps) {
  return (
    <Box overflowX="auto">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Industry</Th>
            <Th>Status</Th>
            <Th>Admins</Th>
            <Th textAlign="right">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {companies.map((company) => (
            <Tr key={company.id}>
              <Td>
                <Text fontWeight="medium">{company.name}</Text>
              </Td>
              <Td>{company.industry || '—'}</Td>
              <Td>
                <Badge colorScheme={company.status === 'ACTIVE' ? 'green' : 'orange'}>
                  {company.status}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={1}>
                  {company.admins?.map((admin) => (
                    <Badge key={admin.id} colorScheme={admin.status === 'ACTIVE' ? 'green' : 'red'}>
                      {admin.email}
                    </Badge>
                  )) ?? <Text color="gray.500">No admins</Text>}
                </HStack>
              </Td>
              <Td>
                <HStack justify="flex-end">
                  <IconButton
                    aria-label="Invite Company Admin"
                    icon={<FiUsers />}
                    variant="ghost"
                    onClick={() => onInviteAdmin(company.id)}
                  />
                  <IconButton
                    aria-label="Toggle Company Status"
                    icon={<FiRepeat />}
                    variant="ghost"
                    onClick={() =>
                      onToggleStatus(
                        company.id,
                        company.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                      )
                    }
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
