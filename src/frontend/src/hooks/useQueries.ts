import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WoundEntry } from '../backend';
import { ExternalBlob } from '../backend';

export function useWoundHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<WoundEntry[]>({
    queryKey: ['woundHistory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getWoundHistory();
      } catch (error) {
        // If no entries exist yet, return empty array
        if (error instanceof Error && error.message.includes('No entry found')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWoundEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      photo,
      contentType,
      questionnaireResponses,
      generatedReport,
    }: {
      photo: ExternalBlob;
      contentType: string;
      questionnaireResponses: string;
      generatedReport: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addWoundEntry(photo, contentType, questionnaireResponses, generatedReport);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['woundHistory'] });
    },
  });
}
