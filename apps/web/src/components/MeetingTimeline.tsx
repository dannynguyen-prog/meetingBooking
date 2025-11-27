import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';

type Meeting = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room?: { name: string };
  guests?: { employee: { firstName: string; lastName: string } }[];
};

type MeetingTimelineProps = {
  meetings: Meeting[];
};

export function MeetingTimeline({ meetings }: MeetingTimelineProps) {
  return (
    <Stack spacing={4}>
      {meetings.map((meeting) => (
        <Flex
          key={meeting.id}
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          p={4}
          rounded="lg"
          border="1px solid"
          borderColor="gray.100"
          bg="white"
        >
          <Box>
            <Heading size="sm">{meeting.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {meeting.room?.name ?? 'Unassigned room'}
            </Text>
          </Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Text fontWeight="medium">
              {new Date(meeting.startTime).toLocaleString()} —{' '}
              {new Date(meeting.endTime).toLocaleTimeString()}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {meeting.guests?.length ?? 0} guests
            </Text>
          </Box>
        </Flex>
      ))}
    </Stack>
  );
}
