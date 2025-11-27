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
import { useRef, useState } from 'react';

type CreateCompanyDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    industry?: string;
    address?: string;
    logoUrl?: string;
  }) => void;
  isLoading?: boolean;
};

export function CreateCompanyDrawer({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: CreateCompanyDrawerProps) {
  const initialRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    address: '',
    logoUrl: ''
  });

  const handleSubmit = () => {
    onSubmit({
      name: form.name,
      industry: form.industry || undefined,
      address: form.address || undefined,
      logoUrl: form.logoUrl || undefined
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      initialFocusRef={initialRef}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create Company</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={initialRef}
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Industry</FormLabel>
              <Input
                value={form.industry}
                onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Logo URL</FormLabel>
              <Input
                value={form.logoUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))}
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
            isDisabled={!form.name.trim()}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
