import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '../../services/axiosInstance';
import type { AxiosRequestConfig } from 'axios';

// Custom base query using axios instance
// The axiosInstance automatically adds Authorization header via interceptor
// from localStorage.getItem('accessToken')
const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ url, method, data, params, headers }: AxiosRequestConfig) => {
    try {
      // Merge any additional headers passed from the query
      const mergedHeaders = {
        ...headers,
      };
      
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: mergedHeaders,
      });
      return { data: result.data };
    } catch (axiosError: any) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// Base API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: '', // Empty because axiosInstance already has baseURL
  }),
  tagTypes: ['User', 'Auth', 'ReferralOwner', 'ReferralCode', 'ReferralOwed', 'ReferralTransfer'],
  endpoints: () => ({}),
});
