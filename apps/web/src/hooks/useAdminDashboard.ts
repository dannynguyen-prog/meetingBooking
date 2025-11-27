import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../lib/api-client';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.companies);
      return data;
    }
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      industry?: string;
      address?: string;
      logoUrl?: string;
    }) => {
      const { data } = await api.post(endpoints.companies, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
}

export function useMeetingRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.meetingRooms);
      return data;
    }
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.employees);
      return data;
    }
  });
}

export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data } = await api.get(`${endpoints.meetings}/mine`);
      return data;
    }
  });
}
