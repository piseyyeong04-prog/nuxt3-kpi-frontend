// composables/usePRTracking.ts
import axios from 'axios';

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
}

export interface DirectusUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  role?: string;
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
export const EDITOR_ROLE_ID  = 'af115dbc-3aad-4879-8c1e-5ed0059ec576';
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
].join(',');

export const usePRTracking = () => {
  /** Fetch all PR tracking records */
  const fetchAll = async (): Promise<PRTrackingExpanded[]> => {
    const res = await useApi<DirectusResponse<PRTrackingExpanded[]>>(
      `${COLLECTION}?fields=${FIELDS}&sort=-id&limit=200`,
      { method: 'GET' }
    );
    return res.data;
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
    paginatedUsers(EDITOR_ROLE_ID);

  const create = async (
    payload: Omit<PRTracking, 'id' | 'user_created' | 'sort'>
  ): Promise<PRTrackingExpanded> => {
    const res = await useApi<DirectusResponse<PRTrackingExpanded>>(
      `${COLLECTION}?fields=${FIELDS}`,
      { method: 'POST', data: payload }
    );
    return res.data;
  };

  const update = async (
    id: string | number,
    payload: Partial<Omit<PRTracking, 'id' | 'user_created' | 'sort'>>
  ): Promise<PRTrackingExpanded> => {
    const res = await useApi<DirectusResponse<PRTrackingExpanded>>(
      `${COLLECTION}/${id}?fields=${FIELDS}`,
      { method: 'PATCH', data: payload }
    );
    return res.data;
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
