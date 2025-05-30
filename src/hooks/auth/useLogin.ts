import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../services/auth_service";
import { TokenService } from "../../services/token_service";

const authService = new AuthService();

/**
 * Hook for login functionality
 * Only responsible for the login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await authService.login({ email, password });
      return result;
    },
    onSuccess: (result) => {
      if (result.status_code === 200 && result.data) {
        console.log("Login successful, setting token:", result.data);
        TokenService.setToken(result.data);

        // Trigger re-fetch of auth status
        queryClient.invalidateQueries({ queryKey: ["auth", "status"] });
      }
    },
  });
};
