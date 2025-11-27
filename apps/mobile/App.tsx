import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  useAvailableRooms,
  useBookMeeting,
  useCancelMeeting,
  useUpcomingMeetings,
  useUpdateMeeting
} from './src/hooks/useBookings';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <Dashboard />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

function Dashboard() {
  const [selectedMeeting, setSelectedMeeting] = useState<any>();
  const [isModalVisible, setModalVisible] = useState(false);
  const { data: meetings = [] } = useUpcomingMeetings();

  const handleCreate = () => {
    setSelectedMeeting(undefined);
    setModalVisible(true);
  };

  const handleEdit = (meeting: any) => {
    setSelectedMeeting(meeting);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming meetings</Text>
        <Pressable style={styles.primaryButton} onPress={handleCreate}>
          <Text style={styles.primaryButtonText}>Book meeting</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        {meetings.map((meeting: any) => (
          <Pressable key={meeting.id} style={styles.meetingRow} onPress={() => handleEdit(meeting)}>
            <View>
              <Text style={styles.meetingTitle}>{meeting.title}</Text>
              <Text style={styles.meetingSubtitle}>{meeting.room?.name ?? 'Unassigned room'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.meetingTime}>
                {dayjs(meeting.startTime).format('MMM D, HH:mm')} -{' '}
                {dayjs(meeting.endTime).format('HH:mm')}
              </Text>
              <Text style={styles.meetingGuests}>{meeting.guests?.length ?? 0} guests</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calendar</Text>
        <Calendar
          style={{ width: '100%' }}
          markingType="multi-dot"
          markedDates={meetings.reduce<Record<string, any>>((acc, meeting: any) => {
            const key = dayjs(meeting.startTime).format('YYYY-MM-DD');
            acc[key] = {
              dots: [{ color: '#2563eb' }],
              marked: true
            };
            return acc;
          }, {})}
        />
      </View>

      <MeetingSheet
        isOpen={isModalVisible}
        onClose={() => setModalVisible(false)}
        meeting={selectedMeeting}
      />
    </ScrollView>
  );
}

type MeetingSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  meeting?: any;
};

function MeetingSheet({ isOpen, onClose, meeting }: MeetingSheetProps) {
  const [title, setTitle] = useState(meeting?.title ?? '');
  const [startTime, setStartTime] = useState(
    meeting ? dayjs(meeting.startTime).format('YYYY-MM-DDTHH:mm') : ''
  );
  const [endTime, setEndTime] = useState(
    meeting ? dayjs(meeting.endTime).format('YYYY-MM-DDTHH:mm') : ''
  );
  const [roomId, setRoomId] = useState(meeting?.roomId ?? '');

  const { data: rooms = [] } = useAvailableRooms(startTime, endTime);
  const bookMeeting = useBookMeeting();
  const updateMeeting = useUpdateMeeting();
  const cancelMeeting = useCancelMeeting();

  const isEditing = Boolean(meeting?.id);

  const handleSubmit = async () => {
    const payload = {
      title,
      startTime,
      endTime,
      roomId,
      guestIds: meeting?.guests?.map((guest: any) => guest.employee.id) ?? []
    };
    if (isEditing) {
      await updateMeeting.mutateAsync({ id: meeting.id, ...payload });
    } else {
      await bookMeeting.mutateAsync(payload);
    }
    onClose();
  };

  const handleCancel = async () => {
    if (meeting?.id) {
      await cancelMeeting.mutateAsync(meeting.id);
      onClose();
    }
  };

  const availableRooms = useMemo(() => rooms ?? [], [rooms]);

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.sheetTitle}>{isEditing ? 'Update meeting' : 'Book meeting'}</Text>
          <TextInput
            placeholder="Meeting title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Start time"
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
            inputMode="numeric"
          />
          <TextInput
            placeholder="End time"
            style={styles.input}
            value={endTime}
            onChangeText={setEndTime}
            inputMode="numeric"
          />
          <TextInput
            placeholder="Room ID"
            style={styles.input}
            value={roomId}
            onChangeText={setRoomId}
          />
          <Text style={styles.sectionLabel}>Available rooms</Text>
          {availableRooms.map((room: any) => (
            <Pressable key={room.id} style={styles.roomRow} onPress={() => setRoomId(room.id)}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomCapacity}>{room.capacity} ppl</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.sheetActions}>
          {isEditing && (
            <Pressable style={[styles.secondaryButton, { flex: 1 }]} onPress={handleCancel}>
              <Text style={styles.secondaryButtonText}>Cancel meeting</Text>
            </Pressable>
          )}
          <Pressable style={[styles.primaryButton, { flex: 1 }]} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>
              {isEditing ? 'Save changes' : 'Book meeting'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f1f5f9'
  },
  container: {
    padding: 16,
    gap: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  meetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a'
  },
  meetingSubtitle: {
    fontSize: 14,
    color: '#475569'
  },
  meetingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb'
  },
  meetingGuests: {
    fontSize: 12,
    color: '#94a3b8'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  secondaryButton: {
    borderColor: '#cbd5f5',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  secondaryButtonText: {
    color: '#64748b',
    fontWeight: '600'
  },
  modalSafe: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalContent: {
    padding: 16,
    gap: 12
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16
  },
  roomRow: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600'
  },
  roomCapacity: {
    fontSize: 14,
    color: '#475569'
  },
  sheetActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12
  }
});
