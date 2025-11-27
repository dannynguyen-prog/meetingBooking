'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  colors: {
    brand: {
      50: '#e4f0ff',
      100: '#bfd4fd',
      200: '#99b6f5',
      300: '#7398ee',
      400: '#4d7ae6',
      500: '#3350cc',
      600: '#263ca1',
      700: '#1a2876',
      800: '#0c154b',
      900: '#020222'
    }
  }
});

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
