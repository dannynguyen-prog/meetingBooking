'use client';

import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
  Link as ChakraLink
} from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '../store/auth-store';
import { FiLogOut } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Companies', href: '/companies' },
  { label: 'Meeting Rooms', href: '/rooms' },
  { label: 'Employees', href: '/employees' },
  { label: 'Meetings', href: '/meetings' }
];

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { user, logout } = useAuth();

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        w={{ base: '240px' }}
        bg="white"
        borderRight="1px solid #e5e7eb"
        p={6}
        display={{ base: 'none', md: 'block' }}
      >
        <Heading size="md" mb={8}>
          Meeting Booking
        </Heading>
        <VStack align="stretch" spacing={3}>
          {navItems.map((item) => (
            <ChakraLink
              as={Link}
              key={item.href}
              href={item.href}
              fontWeight="medium"
              color="gray.600"
              _hover={{ color: 'brand.500' }}
            >
              {item.label}
            </ChakraLink>
          ))}
        </VStack>
      </Box>
      <Flex direction="column" flex="1">
        <Flex
          as="header"
          justify="space-between"
          align="center"
          px={6}
          py={4}
          borderBottom="1px solid #e5e7eb"
          bg="white"
        >
          <Text fontSize="sm" color="gray.500">
            {user?.role === 'SYSTEM_ADMIN' ? 'System Admin' : 'Company Admin'} console
          </Text>
          <HStack spacing={3}>
            <Avatar size="sm" name={`${user?.firstName} ${user?.lastName}`} />
            <Text fontWeight="medium">{user?.firstName}</Text>
            <IconButton
              aria-label="Sign out"
              icon={<FiLogOut />}
              variant="ghost"
              onClick={() => {
                logout();
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('admin-token');
                }
                window.location.href = '/login';
              }}
            />
          </HStack>
        </Flex>
        <Box as="main" flex="1" p={6}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
