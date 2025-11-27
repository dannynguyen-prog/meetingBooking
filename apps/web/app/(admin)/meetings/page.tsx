'use client';

import { Box, Button, Heading, HStack, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { MeetingTimeline } from '../../../src/components/MeetingTimeline';
import { MeetingFormDrawer } from '../../../src/components/MeetingFormDrawer';
import { useEmployees, useMeetings, useMeetingRooms } from '../../../src/hooks/useAdminDashboard';
import api, { endpoints } from '../../../src/lib/api-client';
import { useState } from 'react';

export default function MeetingsPage() {
  const toast = useToast();
  const { data: meetings = [], refetch } = useMeetings();
  const { data: employees = [] } = useEmployees();
  const { data: rooms = [] } = useMeetingRooms();
  const drawer = useDisclosure();
  const [selectedMeeting, setSelectedMeeting] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedMeeting(undefined);
    drawer.onOpen();
  };

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      if (selectedMeeting?.id) {
        await api.patch(`${endpoints.meetings}/${selectedMeeting.id}`, payload);
      } else {
        await api.post(endpoints.meetings, payload);
      }
      toast({ title: 'Meeting saved', status: 'success' });
      drawer.onClose();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Unable to save meeting',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (meetingId: string) => {
    try {
      await api.delete(`${endpoints.meetings}/${meetingId}`);
      toast({ title: 'Meeting cancelled', status: 'success' });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Unable to cancel meeting',
        description: error?.response?.data?.message ?? 'Try again later.',
        status: 'error'
      });
    }
  };

  return (
    <Stack spacing={6}>
      <Box bg="white" p={6} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
        <HStack justify="space-between" mb={4}>
          <Heading size="md">Meetings</Heading>
          <Button colorScheme="brand" onClick={handleCreate}>
            Book meeting
          </Button>
        </HStack>
        <MeetingTimeline meetings={meetings} />
      </Box>

      <MeetingFormDrawer
        isOpen={drawer.isOpen}
        onClose={drawer.onClose}
        onSubmit={handleSubmit}
        defaultValues={selectedMeeting}
        isLoading={isSubmitting}
        employees={employees}
        rooms={rooms}
      />
    </Stack>
  );
}
