import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/auth_service';
import { TokenService } from '../services/token_service';

const authService = new AuthService();

// Hook for login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await authService.login({ email, password });
      return result;
    },
    onSuccess: (result) => {
      if (result.status_code === 200 && result.data && result.data.token) {
        TokenService.setToken(result.data.token);
      }
    },
  });
};

// Hook for checking authentication status
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: () => {
      const token = TokenService.getToken();
      return { isLoggedIn: !!token, token };
    },
    staleTime: 30 * 1000, // Check every 30 seconds
    refetchInterval: 30 * 1000,
  });
};
