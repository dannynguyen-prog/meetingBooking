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
  NumberInput,
  NumberInputField,
  Stack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type RoomFormValues = {
  name: string;
  capacity: number;
  availableFrom: number;
  availableTo: number;
  location?: string;
};

type RoomFormDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues) => void;
  defaultValues?: RoomFormValues;
  isLoading?: boolean;
};

export function RoomFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isLoading
}: RoomFormDrawerProps) {
  const [values, setValues] = useState<RoomFormValues>(
    defaultValues ?? {
      name: '',
      capacity: 4,
      availableFrom: 8,
      availableTo: 18,
      location: ''
    }
  );

  useEffect(() => {
    if (defaultValues) {
      setValues(defaultValues);
    }
  }, [defaultValues]);

  const handleSubmit = () => onSubmit(values);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{defaultValues ? 'Edit room' : 'Create room'}</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={values.name}
                onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Capacity</FormLabel>
              <NumberInput
                min={1}
                value={values.capacity}
                onChange={(_, value) => setValues((prev) => ({ ...prev, capacity: value }))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <Stack direction="row">
              <FormControl>
                <FormLabel>Available from</FormLabel>
                <NumberInput
                  min={0}
                  max={23}
                  value={values.availableFrom}
                  onChange={(_, value) => setValues((prev) => ({ ...prev, availableFrom: value }))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Available to</FormLabel>
                <NumberInput
                  min={0}
                  max={23}
                  value={values.availableTo}
                  onChange={(_, value) => setValues((prev) => ({ ...prev, availableTo: value }))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                value={values.location || ''}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, location: event.target.value }))
                }
              />
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={!values.name.trim()}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
