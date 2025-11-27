import { Badge, Box, HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';

type Room = {
  id: string;
  name: string;
  capacity: number;
  availableFrom: number;
  availableTo: number;
  status: 'ACTIVE' | 'INACTIVE';
};

type RoomTableProps = {
  rooms: Room[];
  onEdit: (room: Room) => void;
};

export function RoomTable({ rooms, onEdit }: RoomTableProps) {
  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Capacity</Th>
            <Th>Hours</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {rooms.map((room) => (
            <Tr key={room.id}>
              <Td>{room.name}</Td>
              <Td>{room.capacity}</Td>
              <Td>
                {room.availableFrom}:00 - {room.availableTo}:00
              </Td>
              <Td>
                <Badge colorScheme={room.status === 'ACTIVE' ? 'green' : 'red'}>
                  {room.status}
                </Badge>
              </Td>
              <Td textAlign="right">
                <HStack justify="flex-end">
                  <IconButton
                    aria-label="Edit room"
                    icon={<FiEdit />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(room)}
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
