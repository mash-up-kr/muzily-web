import type { AxiosError } from "axios";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { useMutation, useQuery } from "react-query";

export function useCoreQuery<T>(
  keyName: QueryKey,
  query: QueryFunction<T, QueryKey>,
  options?: Omit<UseQueryOptions<T, AxiosError>, "queryKey" | "queryFn">
): UseQueryResult<T, AxiosError> {
  return useQuery(keyName, query, {
    onError: (err) => console.error(err),
    ...options,
  });
}

export function useCoreMutation<T, U>(
  mutation: MutationFunction<T, U>,
  options?: Omit<UseMutationOptions<T, AxiosError, U>, "mutationKey">
): UseMutationResult<T, AxiosError, U> {
  return useMutation(mutation, {
    onError: (err) => console.error(err),
    ...options,
  });
}
