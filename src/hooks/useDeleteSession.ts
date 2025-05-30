// Legacy export wrapper for useDeleteSession compatibility
import { useSessionOperations } from "./session/useSessionOperations";

export const useDeleteSession = () => {
  const { deleteSession, deleteMutation } = useSessionOperations();

  // Return the mutation object to maintain compatibility with the original API
  return {
    mutate: deleteSession,
    ...deleteMutation,
  };
};
