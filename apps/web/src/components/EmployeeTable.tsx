import { Badge, Box, Button, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type EmployeeTableProps = {
  employees: Employee[];
  onToggleStatus: (employeeId: string, nextStatus: 'ACTIVE' | 'INACTIVE') => void;
};

export function EmployeeTable({ employees, onToggleStatus }: EmployeeTableProps) {
  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.map((employee) => (
            <Tr key={employee.id}>
              <Td>
                {employee.firstName} {employee.lastName}
              </Td>
              <Td>{employee.email}</Td>
              <Td>
                <Badge colorScheme={employee.status === 'ACTIVE' ? 'green' : 'red'}>
                  {employee.status}
                </Badge>
              </Td>
              <Td textAlign="right">
                <HStack justify="flex-end">
                  <Button
                    size="xs"
                    onClick={() =>
                      onToggleStatus(
                        employee.id,
                        employee.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                      )
                    }
                  >
                    {employee.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
