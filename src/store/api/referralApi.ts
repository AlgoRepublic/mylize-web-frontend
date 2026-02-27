import { baseApi } from './baseApi';
import type {
  ReferralOwnerApi,
  ReferralCodeApi,
  ReferralOwedApi,
  ReferralTransferApi,
} from '../../types/api.types';

// UI-facing types used by the referral-system component
export interface ReferralOwner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bankAccount?: string;
  paymentMethod: 'bank_transfer' | 'paypal' | 'crypto' | 'cash';
  paymentDetails: string;
  isActive: boolean;
  createdAt: Date;
  owedAmount: number;
  totalPaid: number;
}

export interface ReferralCode {
  id: string;
  code: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
  usageCount: number;
  maxUsage?: number;
  totalEarnings: number;
}

export interface ReferralOwed {
  id: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  description: string;
  date: Date;
  notes?: string;
}

export interface ReferralTransfer {
  id: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  transactionNumber: string;
  transferDate: Date;
  notes?: string;
}

/** Dashboard stats from GET /analysts/referrals/dashboard */
export interface ReferralDashboard {
  totalOwners: number;
  activeOwners: number;
  activeOwnersNewThisMonth: number;
  totalOwed: number;
  totalPaid: number;
  thisMonthTransactions: number;
  thisMonthTransfers: number;
  thisMonthTransfersPercentageChange: number;
  totalPaidTransfers: number;
}

function mapOwnerApiToOwner(api: ReferralOwnerApi): ReferralOwner {
  const name = api.fullName ?? api.name ?? '';
  return {
    id: api._id,
    name,
    email: api.email ?? '',
    phone: api.phone,
    bankAccount: api.bankAccount,
    paymentMethod: (api.paymentMethod as ReferralOwner['paymentMethod']) ?? 'bank_transfer',
    paymentDetails: api.paymentDetails ?? '',
    isActive: api.isActive ?? true,
    createdAt: api.createdAt ? new Date(api.createdAt) : new Date(),
    owedAmount: typeof api.owedAmount === 'number' ? api.owedAmount : 0,
    totalPaid: typeof api.totalPaid === 'number' ? api.totalPaid : 0,
  };
}

function mapCodeApiToCode(api: ReferralCodeApi, ownerName?: string): ReferralCode {
  const name = api.codeName ?? api.name ?? '';
  const code = api.code ?? api._id ?? '';
  return {
    id: api._id,
    code,
    name,
    description: api.description ?? '',
    ownerId: api.referralOwner ?? api.ownerId ?? '',
    ownerName: api.ownerName ?? ownerName ?? '',
    commissionRate: typeof api.commissionRate === 'number' ? api.commissionRate : 0,
    isActive: api.isActive ?? true,
    createdAt: api.createdAt ? new Date(api.createdAt) : new Date(),
    expiresAt: api.expiresAt ? new Date(api.expiresAt) : undefined,
    usageCount: typeof api.usageCount === 'number' ? api.usageCount : 0,
    maxUsage: api.maxUsage,
    totalEarnings: typeof api.totalEarnings === 'number' ? api.totalEarnings : 0,
  };
}

function mapOwedApiToOwed(api: ReferralOwedApi): ReferralOwed {
  return {
    id: api._id,
    ownerId: api.referralOwner ?? api.ownerId ?? '',
    ownerName: api.ownerName ?? '',
    amount: typeof api.amount === 'number' ? api.amount : 0,
    description: api.description ?? '',
    date: api.createdAt ? new Date(api.createdAt) : api.date ? new Date(api.date) : new Date(),
    notes: api.notes,
  };
}

function mapTransferApiToTransfer(api: ReferralTransferApi): ReferralTransfer {
  return {
    id: api._id,
    ownerId: api.referralOwner ?? api.ownerId ?? '',
    ownerName: api.ownerName ?? '',
    amount: typeof api.amount === 'number' ? api.amount : 0,
    transactionNumber: api.transactionNumber ?? '',
    transferDate: api.transferDate ? new Date(api.transferDate) : new Date(),
    notes: api.notes,
  };
}

// Response wrappers – API may return { data: T } or T[] or { success, data }
function extractList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object' && 'data' in (response as { data?: T[] })) {
    const data = (response as { data: T[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

/** Raw dashboard API response shape */
interface ReferralDashboardApi {
  activeOwners?: { count?: number; total?: number; newThisMonth?: number };
  totalOwed?: { amount?: number; newThisMonth?: number };
  totalPaid?: { amount?: number; referralTransfersCount?: number };
  referralTransfersThisMonth?: { count?: number; percentageChange?: number };
}

function extractDashboard(raw: unknown): ReferralDashboard {
  const wrap = raw && typeof raw === 'object' && 'data' in (raw as { data?: unknown })
    ? (raw as { data: ReferralDashboardApi }).data
    : (raw as ReferralDashboardApi);
  if (!wrap || typeof wrap !== 'object') {
    return {
      totalOwners: 0,
      activeOwners: 0,
      activeOwnersNewThisMonth: 0,
      totalOwed: 0,
      totalPaid: 0,
      thisMonthTransactions: 0,
      thisMonthTransfers: 0,
      thisMonthTransfersPercentageChange: 0,
      totalPaidTransfers: 0,
    };
  }
  const n = (v: unknown) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0);
  const ao = wrap.activeOwners && typeof wrap.activeOwners === 'object' ? wrap.activeOwners : {};
  const owed = wrap.totalOwed && typeof wrap.totalOwed === 'object' ? wrap.totalOwed : {};
  const paid = wrap.totalPaid && typeof wrap.totalPaid === 'object' ? wrap.totalPaid : {};
  const transfersMonth = wrap.referralTransfersThisMonth && typeof wrap.referralTransfersThisMonth === 'object' ? wrap.referralTransfersThisMonth : {};
  return {
    totalOwners: n(ao.total),
    activeOwners: n(ao.count),
    activeOwnersNewThisMonth: n(ao.newThisMonth),
    totalOwed: n(owed.amount),
    totalPaid: n(paid.amount),
    totalPaidTransfers: n(paid.referralTransfersCount),
    thisMonthTransactions: n(owed.newThisMonth),
    thisMonthTransfers: n(transfersMonth.count),
    thisMonthTransfersPercentageChange: n(transfersMonth.percentageChange),
  };
}

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferralDashboard: builder.query<ReferralDashboard, void>({
      query: () => ({
        url: '/analysts/referrals/dashboard',
        method: 'GET',
        headers: { 'Accept-Language': 'en' },
      }),
      transformResponse: extractDashboard,
      providesTags: [{ type: 'ReferralOwner' as const, id: 'LIST' }],
    }),

    // Owners
    getReferralOwners: builder.query<ReferralOwner[], void>({
      query: () => ({
        url: '/analysts/referrals/owners',
        method: 'GET',
        headers: { 'Accept-Language': 'en' },
      }),
      transformResponse: (raw: unknown) => {
        const list = extractList<ReferralOwnerApi>(raw);
        return list.map(mapOwnerApiToOwner);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ReferralOwner' as const, id })),
              { type: 'ReferralOwner' as const, id: 'LIST' },
            ]
          : [{ type: 'ReferralOwner' as const, id: 'LIST' }],
    }),

    getReferralOwner: builder.query<ReferralOwner, string>({
      query: (id) => ({
        url: `/analysts/referrals/owners/${id}`,
        method: 'GET',
        headers: { 'Accept-Language': 'en' },
      }),
      transformResponse: (raw: unknown) => {
        const api = raw as ReferralOwnerApi;
        return mapOwnerApiToOwner(api);
      },
      providesTags: (_result, _err, id) => [{ type: 'ReferralOwner' as const, id }],
    }),

    createReferralOwner: builder.mutation<ReferralOwner, {
      fullName: string;
      email: string;
      phone?: string;
      phoneCode?: string;
      paymentMethod: string;
      bankAccount?: string;
      paymentDetails: string;
    }>({
      query: (body) => {
        const form = new FormData();
        form.append('fullName', body.fullName);
        form.append('email', body.email);
        if (body.phone) form.append('phone', body.phone);
        if (body.phoneCode) form.append('phoneCode', body.phoneCode);
        form.append('paymentMethod', body.paymentMethod);
        if (body.bankAccount) form.append('bankAccount', body.bankAccount);
        form.append('paymentDetails', body.paymentDetails);
        return {
          url: '/analysts/referrals/owners',
          method: 'POST',
          data: form,
          headers: { 'Accept-Language': 'en' },
        };
      },
      transformResponse: (raw: unknown) => mapOwnerApiToOwner(raw as ReferralOwnerApi),
      invalidatesTags: [{ type: 'ReferralOwner', id: 'LIST' }],
    }),

    toggleReferralOwner: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/analysts/referrals/owners/${id}/toggle`,
        method: 'PATCH',
        headers: { 'Accept-Language': 'en' },
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'ReferralOwner', id },
        { type: 'ReferralOwner', id: 'LIST' },
      ],
    }),

    // Codes
    getReferralCodes: builder.query<ReferralCode[], void>({
      query: () => ({
        url: '/analysts/referrals/codes',
        method: 'GET',
        headers: { 'Accept-Language': 'en' },
      }),
      transformResponse: (raw: unknown) => {
        const list = extractList<ReferralCodeApi>(raw);
        return list.map((api) => mapCodeApiToCode(api));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ReferralCode' as const, id })),
              { type: 'ReferralCode' as const, id: 'LIST' },
            ]
          : [{ type: 'ReferralCode' as const, id: 'LIST' }],
    }),

    createReferralCode: builder.mutation<ReferralCode, {
      codeName: string;
      description: string;
      referralOwner: string;
      commissionRate: number;
      maxUsage?: number;
    }>({
      query: (body) => {
        const form = new FormData();
        form.append('codeName', body.codeName);
        form.append('description', body.description);
        form.append('referralOwner', body.referralOwner);
        form.append('commissionRate', String(body.commissionRate));
        if (body.maxUsage != null) form.append('maxUsage', String(body.maxUsage));
        return {
          url: '/analysts/referrals/codes',
          method: 'POST',
          data: form,
          headers: { 'Accept-Language': 'en' },
        };
      },
      transformResponse: (raw: unknown) => mapCodeApiToCode(raw as ReferralCodeApi),
      invalidatesTags: [{ type: 'ReferralCode', id: 'LIST' }],
    }),

    toggleReferralCode: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/analysts/referrals/codes/${id}/toggle`,
        method: 'PATCH',
        headers: { 'Accept-Language': 'en' },
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'ReferralCode', id },
        { type: 'ReferralCode', id: 'LIST' },
      ],
    }),

    // Owed
    getReferralOwed: builder.query<ReferralOwed[], void>({
      query: () => ({
        url: '/analysts/referrals/owed',
        method: 'GET',
        headers: { 'Accept-Language': 'en' },
      }),
      transformResponse: (raw: unknown) => {
        const list = extractList<ReferralOwedApi>(raw);
        return list.map(mapOwedApiToOwed);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ReferralOwed' as const, id })),
              { type: 'ReferralOwed' as const, id: 'LIST' },
            ]
          : [{ type: 'ReferralOwed' as const, id: 'LIST' }],
    }),

    createReferralOwed: builder.mutation<ReferralOwed, {
      referralOwner: string;
      amount: number;
      description: string;
      notes?: string;
    }>({
      query: (body) => {
        const form = new FormData();
        form.append('referralOwner', body.referralOwner);
        form.append('amount', String(body.amount));
        form.append('description', body.description);
        if (body.notes) form.append('notes', body.notes);
        return {
          url: '/analysts/referrals/owed',
          method: 'POST',
          data: form,
          headers: { 'Accept-Language': 'en' },
        };
      },
      transformResponse: (raw: unknown) => mapOwedApiToOwed(raw as ReferralOwedApi),
      invalidatesTags: [
        { type: 'ReferralOwed', id: 'LIST' },
        { type: 'ReferralOwner', id: 'LIST' },
      ],
    }),

    // Transfers (GET only – no POST in API spec)
    getReferralTransfers: builder.query<ReferralTransfer[], void>({
      query: () => ({
        url: '/analysts/referrals/transfers',
        method: 'GET',
        headers: { 'Accept-Language': 'en' },
      }),
      transformResponse: (raw: unknown) => {
        const list = extractList<ReferralTransferApi>(raw);
        return list.map(mapTransferApiToTransfer);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ReferralTransfer' as const, id })),
              { type: 'ReferralTransfer' as const, id: 'LIST' },
            ]
          : [{ type: 'ReferralTransfer' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetReferralDashboardQuery,
  useGetReferralOwnersQuery,
  useGetReferralOwnerQuery,
  useCreateReferralOwnerMutation,
  useToggleReferralOwnerMutation,
  useGetReferralCodesQuery,
  useCreateReferralCodeMutation,
  useToggleReferralCodeMutation,
  useGetReferralOwedQuery,
  useCreateReferralOwedMutation,
  useGetReferralTransfersQuery,
} = referralApi;
