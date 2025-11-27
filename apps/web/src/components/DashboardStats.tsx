import { SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';

type StatItem = {
  label: string;
  value: string | number;
};

type DashboardStatsProps = {
  items: StatItem[];
};

export function DashboardStats({ items }: DashboardStatsProps) {
  const bg = useColorModeValue('white', 'gray.800');
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      {items.map((item) => (
        <Stat
          key={item.label}
          p={6}
          rounded="lg"
          shadow="sm"
          bg={bg}
          border="1px solid"
          borderColor="gray.100"
        >
          <StatLabel fontSize="sm" textTransform="uppercase" color="gray.500">
            {item.label}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold">
            {item.value}
          </StatNumber>
        </Stat>
      ))}
    </SimpleGrid>
  );
}
