'use client';

import { Box, Button, Heading, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { RoomTable } from '../../../src/components/RoomTable';
import { RoomFormDrawer } from '../../../src/components/RoomFormDrawer';
import { useMeetingRooms } from '../../../src/hooks/useAdminDashboard';
import api, { endpoints } from '../../../src/lib/api-client';
import { useState } from 'react';

export default function RoomsPage() {
  const toast = useToast();
  const { data: rooms = [], refetch } = useMeetingRooms();
  const drawer = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedRoom(undefined);
    drawer.onOpen();
  };

  const handleEdit = (room: any) => {
    setSelectedRoom(room);
    drawer.onOpen();
  };

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      if (selectedRoom) {
        await api.patch(`${endpoints.meetingRooms}/${selectedRoom.id}`, payload);
      } else {
        await api.post(endpoints.meetingRooms, payload);
      }
      toast({ title: 'Room saved', status: 'success' });
      drawer.onClose();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Unable to save room',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    } finally {
      setIsSubmitting(false);
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
          <Heading size="md">Meeting rooms</Heading>
          <Button colorScheme="brand" onClick={handleCreate}>
            Create room
          </Button>
        </Stack>
        <RoomTable rooms={rooms} onEdit={handleEdit} />
      </Box>
      <RoomFormDrawer
        isOpen={drawer.isOpen}
        onClose={drawer.onClose}
        onSubmit={handleSubmit}
        defaultValues={selectedRoom}
        isLoading={isSubmitting}
      />
    </Stack>
  );
}
