'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import api, { endpoints } from '../../../src/lib/api-client';
import { useAuth } from '../../../src/store/auth-store';

export default function LoginPage() {
  const toast = useToast();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post(endpoints.authLogin, form);
      login({
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        companyId: data.user.companyId,
        token: data.accessToken
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-token', data.accessToken);
      }
      window.location.href = '/'; // redirect to dashboard
    } catch (error: any) {
      toast({
        title: 'Unable to sign in',
        description: error?.response?.data?.message ?? 'Check your credentials and try again.',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4}>
      <Card maxW="md" w="full" shadow="lg">
        <CardBody>
          <Stack spacing={6}>
            <Box textAlign="center">
              <Heading size="lg">Meeting Booking Admin</Heading>
              <Text color="gray.500">Use the invite email to sign in.</Text>
            </Box>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </FormControl>
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={!form.email || !form.password}
            >
              Sign in
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
