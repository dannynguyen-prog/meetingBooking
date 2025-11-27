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
  Stack
} from '@chakra-ui/react';
import { useState } from 'react';

type InviteEmployeeDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { email: string }) => void;
  isLoading?: boolean;
};

export function InviteEmployeeDrawer({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: InviteEmployeeDrawerProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onSubmit({ email });
    setEmail('');
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Invite employee</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
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
            isDisabled={!email}
            isLoading={isLoading}
          >
            Send invite
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
