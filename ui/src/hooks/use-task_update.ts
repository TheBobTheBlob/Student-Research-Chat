import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetch } from './use-fetch'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData: any) => {
      const response = await useFetch({
        url: '/tasks/update',
        data: taskData,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      console.error('Task update failed', error)
    },
  })
}
