import { baseApi } from './baseApi';
import { mapAnalystToUser } from '../../utils/userMapper';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  UpdateUserData,
  UpdatePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  LogoutPayload,
  ApiResponse,
  LoginApiResponse,
  Analyst,
} from '../../types/api.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Login user — API returns { success, message, data: { analyst } } with accessToken inside analyst (no refresh token)
    login: builder.mutation<LoginApiResponse, LoginCredentials>({
      query: (credentials) => {
        const formData = new FormData();
        formData.append('platform', credentials.platform || 'web');
        formData.append('phone', credentials.phone);
        formData.append('password', credentials.password);
        formData.append('type', credentials.type || 'analyst');

        return {
          url: '/auth/login',
          method: 'POST',
          data: formData,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data?.analyst?.accessToken) {
            localStorage.setItem('accessToken', data.data.analyst.accessToken);
          }
        } catch {
          // Login failed; do not set token
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    // Logout user — backend requires fcmToken in form body; Authorization header added by axios interceptor
    logout: builder.mutation<ApiResponse, LogoutPayload | void>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('fcmToken', payload?.fcmToken ?? 'web');
        return {
          url: '/auth/logout',
          method: 'POST',
          data: formData,
        };
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/info',
        method: 'GET',
        // Authorization header is automatically added by axios interceptor
      }),
      transformResponse: (response: any) => {
        // Handle different response structures
        // Expected: { success: boolean, data: { analyst: Analyst } }
        // Or: { success: boolean, data: Analyst }
        let analyst: Analyst;
        
        if (response.data?.analyst) {
          // Nested structure: { data: { analyst: {...} } }
          analyst = response.data.analyst;
        } else if (response.data && response.data._id) {
          // Direct structure: { data: {...} }
          analyst = response.data;
        } else {
          throw new Error('Invalid response structure from /auth/info');
        }
        
        // Map the API response to User type
        return mapAnalystToUser(analyst);
      },
      providesTags: ['User'],
    }),

    // Update user details
    updateUserDetails: builder.mutation<User, UpdateUserData>({
      query: (data) => ({
        url: '/auth/updatedetails',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Update password
    updatePassword: builder.mutation<AuthResponse, UpdatePasswordData>({
      query: (data) => ({
        url: '/auth/updatepassword',
        method: 'PUT',
        data,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordData>({
      query: (data) => ({
        url: '/auth/forgotpassword',
        method: 'POST',
        data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<AuthResponse, ResetPasswordData>({
      query: ({ token, password }) => ({
        url: `/auth/resetpassword/${token}`,
        method: 'PUT',
        data: { password },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateUserDetailsMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
