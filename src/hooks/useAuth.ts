import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/auth_service";
import { TokenService } from "../services/token_service";

const authService = new AuthService();

// Hook for login mutation
export const useLogin = () => {
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
    },    onSuccess: (result) => {
      if (result.status_code === 200 && result.data) {
        console.log("Login successful, setting token:", result.data);
        TokenService.setToken(result.data);
      }
    },
  });
};

// todo add userid representing for different user
// Hook for checking authentication status
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: () => {
      const token = TokenService.getToken();
      return { isLoggedIn: !!token, token };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable automatic refetching
    retry: false, // Don't retry on failure
  });
};
