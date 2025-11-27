import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type MeetingFormValues = {
  title: string;
  startTime: string;
  endTime: string;
  details?: string;
  roomId: string;
  guestIds: string[];
};

type MeetingFormDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MeetingFormValues) => void;
  defaultValues?: Partial<MeetingFormValues>;
  isLoading?: boolean;
  employees: { id: string; firstName: string; lastName: string }[];
  rooms: { id: string; name: string }[];
};

export function MeetingFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isLoading,
  employees,
  rooms
}: MeetingFormDrawerProps) {
  const [values, setValues] = useState<MeetingFormValues>({
    title: '',
    startTime: '',
    endTime: '',
    details: '',
    roomId: '',
    guestIds: []
  });

  useEffect(() => {
    if (defaultValues) {
      setValues((prev) => ({ ...prev, ...defaultValues }) as MeetingFormValues);
    }
  }, [defaultValues]);

  const handleSubmit = () => onSubmit(values);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{defaultValues?.title ? 'Update meeting' : 'Book meeting'}</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={values.title}
                onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
              />
            </FormControl>
            <Stack direction="row">
              <FormControl>
                <FormLabel>Start time</FormLabel>
                <Input
                  type="datetime-local"
                  value={values.startTime}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, startTime: event.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>End time</FormLabel>
                <Input
                  type="datetime-local"
                  value={values.endTime}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, endTime: event.target.value }))
                  }
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Room</FormLabel>
              <select
                value={values.roomId}
                onChange={(event) => setValues((prev) => ({ ...prev, roomId: event.target.value }))}
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormControl>
              <FormLabel>Guests</FormLabel>
              <select
                multiple
                value={values.guestIds}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    guestIds: Array.from(event.target.selectedOptions).map((option) => option.value)
                  }))
                }
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormControl>
              <FormLabel>Details</FormLabel>
              <Textarea
                value={values.details}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, details: event.target.value }))
                }
              />
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={isLoading}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
