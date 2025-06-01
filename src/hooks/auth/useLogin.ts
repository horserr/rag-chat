import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../services/auth.service";
import { TokenService } from "../../services/token.service";
import type { LoginDto } from "../../models/auth";

const authService = new AuthService();

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: LoginDto) => {
      const token_result = await authService.login({ email, password }); // Use authService instance
      return token_result;
    },
    onSuccess: (result) => {
      if (result.status_code === 200 && result.data) {
        const token = result.data;

        console.log("Login successful, setting token:", token);
        TokenService.setToken(token);
        queryClient.setQueryData(["auth", "check"], token);
      }
    },
  });
};

export default useLogin;
