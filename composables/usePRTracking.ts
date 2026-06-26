// composables/usePRTracking.ts
import axios from 'axios';
import { useAuthStore } from '~/store/useAuthStore'

export interface PRTracking {
  id?: string | number;
  sort?: number | null;
  status: 'Plan' | 'Processing' | 'Shooting / Writing' | 'Editing' | 'Checking' | 'Compleated';
  user_created?: string | null;
  creator_or_writer?: string | null;
  editor?: string | null;
  client: string;
  title: string;
  description?: string;
  start_pr?: string;
  deadline_pr?: string;
  attach_document?: string | null;
  create_to?: string | null;
  id_in_sale_cms?: number | null;
  editing_process?: { id?: string | number; directus_files_id?: string | { id: string } | null }[] | null;
  comment_plan?: string | null;
  comment_processing?: string | null;
  comment_shooting?: string | null;
  comment_editing?: string | null;
  comment_checking?: string | null;
  production_link?: string | null;
  checking_link?: string | null;
}

export interface DirectusUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  department?: {
    id: string | number;
    title: string;
  } | null;
}

export interface PRTrackingExpanded extends Omit<PRTracking, 'creator_or_writer' | 'editor' | 'user_created'> {
  creator_or_writer?: DirectusUser | null;
  editor?: DirectusUser | null;
  user_created?: DirectusUser | null;
}

export interface DirectusResponse<T> {
  data: T;
  meta?: { total_count?: number; filter_count?: number };
}

export const CREATOR_ROLE_ID = '487171a6-b731-4d96-b350-3481868c8f92';
export const WRITER_ROLE_ID  = 'bb5d4a67-a17e-4cdf-9d59-c8f95518797b';
export const EDITOR_ROLE_ID  = 'fe656e58-5b01-496f-ac9c-9c3fadca70af'; // Support actual Editor role
export const ADMIN_ROLE_ID   = '3a5cb98e-02f8-4f09-afd9-dcd43288c756';

const COLLECTION   = '/items/pr_tracking';
const USER_SUBS    = ['id', 'first_name', 'last_name', 'email', 'avatar', 'role', 'department.id', 'department.title'];
const relFields    = (rel: string) => USER_SUBS.map(f => `${rel}.${f}`).join(',');
const FIELDS       = [
  'id', 'sort', 'status',
  relFields('user_created'),
  relFields('creator_or_writer'),
  relFields('editor'),
  'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
  'create_to', 'id_in_sale_cms',
  'editing_process.directus_files_id',
  'comment_plan', 'comment_processing', 'comment_shooting', 'comment_editing', 'comment_checking',
  'production_link', 'checking_link',
].join(',');

export const usePRTracking = () => {
  const authStore = useAuthStore()
  const currentRoleId = () => authStore.user?.role?.id ?? ''

  // Fields the Editor role is allowed to read (safe set - no comments, no M2M)
  const FIELDS_EDITOR = [
    'id', 'sort', 'status',
    'creator_or_writer.id', 'creator_or_writer.first_name', 'creator_or_writer.last_name',
    'editor.id', 'editor.first_name', 'editor.last_name',
    'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
    'editing_process.directus_files_id',
    'production_link', 'checking_link',
  ].join(',')

  /** Returns the initial field set based on current user role */
  const getRoleFields = (): string => {
    const role = currentRoleId()
    // Editor role: use the restricted field set to avoid 403 upfront
    if (role === EDITOR_ROLE_ID || role === 'af115dbc-3aad-4879-8c1e-5ed0059ec576') {
      return FIELDS_EDITOR
    }
    return FIELDS
  }

  /** Check if an error is a 403 Forbidden (handles both AxiosError and plain error) */
  const is403 = (err: any): boolean => {
    // Axios error: err.response.status
    if (err?.response?.status === 403) return true
    // Plain HTTP error: err.status
    if (err?.status === 403) return true
    // Directus error inside err.response.data
    if (err?.response?.data?.errors?.[0]?.extensions?.code === 'FORBIDDEN') return true
    return false
  }

  /** Fetch helper with robust fallback to prevent 403 Forbidden on restricted fields */
  const fetchWithFallback = async <T>(
    urlBuilder: (fields: string) => string,
    options: { method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'; data?: any }
  ): Promise<T> => {

    // Build field sets progressively more restricted
    const FIELDS_FULL = FIELDS

    const FIELDS_NO_COMMENTS = [
      'id', 'sort', 'status',
      relFields('user_created'),
      relFields('creator_or_writer'),
      relFields('editor'),
      'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
      'create_to', 'id_in_sale_cms',
      'editing_process.directus_files_id',
      'production_link', 'checking_link',
    ].join(',')

    const FIELDS_NO_COMMENTS_LINKS = [
      'id', 'sort', 'status',
      relFields('user_created'),
      relFields('creator_or_writer'),
      relFields('editor'),
      'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
      'create_to', 'id_in_sale_cms',
      'editing_process.directus_files_id',
    ].join(',')

    // Minimal: only basic scalar fields + editing process (no relational users)
    const FIELDS_MINIMAL = [
      'id', 'sort', 'status',
      'creator_or_writer', 'editor',
      'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
      'editing_process.directus_files_id',
      'production_link', 'checking_link',
    ].join(',')

    // Ultra-minimal: only scalars, no relations at all
    const FIELDS_ULTRA_MINIMAL = [
      'id', 'sort', 'status',
      'creator_or_writer', 'editor',
      'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
    ].join(',')

    // Without editing_process (junction table read may be blocked)
    const FIELDS_NO_EDITING = [
      'id', 'sort', 'status',
      relFields('user_created'),
      relFields('creator_or_writer'),
      relFields('editor'),
      'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
      'production_link', 'checking_link',
    ].join(',')

    // Safest possible: scalar fields only, no M2M junction, no expanded relations
    const FIELDS_SAFEST = [
      'id', 'sort', 'status',
      'creator_or_writer', 'editor',
      'client', 'title', 'description', 'start_pr', 'deadline_pr', 'attach_document',
      'production_link', 'checking_link',
    ].join(',')

    const fieldSets = [
      getRoleFields(),   // role-appropriate start (avoids 403 for Editor upfront)
      FIELDS_NO_COMMENTS,
      FIELDS_NO_COMMENTS_LINKS,
      FIELDS_MINIMAL,
      FIELDS_NO_EDITING,
      FIELDS_SAFEST,
      FIELDS_ULTRA_MINIMAL,
    ].filter((f, i, arr) => arr.indexOf(f) === i) // deduplicate if roles match

    let lastErr: any
    for (const fields of fieldSets) {
      try {
        const res = await useApi<DirectusResponse<T>>(urlBuilder(fields), options)
        return res.data
      } catch (err: any) {
        if (is403(err)) {
          console.warn(`[usePRTracking] 403 on fields=${fields.slice(0, 80)}... retrying with fewer fields`)
          lastErr = err
          continue
        }
        throw err
      }
    }
    // All fallbacks exhausted
    throw lastErr
  }

  /** Fetch all PR tracking records */
  const fetchAll = async (): Promise<PRTrackingExpanded[]> => {
    return fetchWithFallback<PRTrackingExpanded[]>(
      (fields) => `${COLLECTION}?fields=${fields}&sort=-id&limit=200`,
      { method: 'GET' }
    )
  };

  /** Paginated users filtered by role */
  const paginatedUsers = async (roleFilter?: string): Promise<DirectusUser[]> => {
    const limit = 100;
    let offset = 0;
    let all: DirectusUser[] = [];
    const roleParam = roleFilter ? `&filter[role][_in]=${roleFilter}` : '';

    while (true) {
      const res = await useApi<DirectusResponse<DirectusUser[]>>(
        `/users?fields=${USER_SUBS.join(',')}&limit=${limit}&offset=${offset}&sort=first_name${roleParam}`,
        { method: 'GET' }
      );
      const batch = res.data ?? [];
      all = [...all, ...batch];
      if (batch.length < limit) break;
      offset += limit;
    }
    return all;
  };

  const fetchCreatorsOrWriters = () =>
    paginatedUsers(`${CREATOR_ROLE_ID},${WRITER_ROLE_ID},${ADMIN_ROLE_ID}`);

  const fetchEditors = () =>
    paginatedUsers(`${EDITOR_ROLE_ID},af115dbc-3aad-4879-8c1e-5ed0059ec576`);

  const create = async (
    payload: Omit<PRTracking, 'id' | 'user_created' | 'sort'>
  ): Promise<PRTrackingExpanded> => {
    return fetchWithFallback<PRTrackingExpanded>(
      (fields) => `${COLLECTION}?fields=${fields}`,
      { method: 'POST', data: payload }
    );
  };

  const update = async (
    id: string | number,
    payload: Partial<Omit<PRTracking, 'id' | 'user_created' | 'sort'>>
  ): Promise<PRTrackingExpanded> => {
    return fetchWithFallback<PRTrackingExpanded>(
      (fields) => `${COLLECTION}/${id}?fields=${fields}`,
      { method: 'PATCH', data: payload }
    );
  };

  const remove = async (id: string | number): Promise<void> => {
    await useApi(`${COLLECTION}/${id}`, { method: 'DELETE' });
  };

  /** Upload a file to Directus /files and return its UUID */
  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await useApi<{ data: { id: string } }>('/files', {
      method: 'POST',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.id;
  };

  return { fetchAll, fetchCreatorsOrWriters, fetchEditors, create, update, remove, uploadFile };
};
