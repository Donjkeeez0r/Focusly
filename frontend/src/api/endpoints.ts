import { apiRequest } from './client';
import type {
  AiReport,
  BlocklistItem,
  Category,
  CreateCategoryInput,
  HeatmapItem,
  SaveLogInput,
  Session,
  TimeLog,
  User,
  WeeklyPieItem,
} from '../types';

export const api = {
  me: () => apiRequest<User>('/auth/me'),

  categories: () => apiRequest<Category[]>('/categories'),
  createCategory: (input: CreateCategoryInput) =>
    apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  deleteCategory: (id: string) =>
    apiRequest<{ message: string }>(`/categories/${id}`, { method: 'DELETE' }),

  activeSession: () =>
    apiRequest<Session | null>('/productivity/session/active'),
  sessions: () => apiRequest<Session[]>('/productivity/sessions'),
  startSession: () =>
    apiRequest<Session>('/productivity/session/start', { method: 'POST' }),
  endSession: () =>
    apiRequest<Session>('/productivity/session/end', { method: 'POST' }),

  blocklist: () => apiRequest<BlocklistItem[]>('/productivity/blocklist'),
  addBlockedSite: (input: { url: string; categoryId: string }) =>
    apiRequest<BlocklistItem>('/productivity/blocklist', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  deleteBlockedSite: (id: string) =>
    apiRequest<{ message: string }>(`/productivity/blocklist/${id}`, {
      method: 'DELETE',
    }),
  checkSite: (url: string) =>
    apiRequest<{ url: string; isBlocked: boolean }>(
      `/productivity/check-site?url=${encodeURIComponent(url)}`,
    ),

  logs: () => apiRequest<TimeLog[]>('/productivity/logs'),
  saveLogs: (logs: SaveLogInput[]) =>
    apiRequest<{ message: string }>('/productivity/logs', {
      method: 'POST',
      body: JSON.stringify({ logs }),
    }),

  weeklyPie: () => apiRequest<WeeklyPieItem[]>('/stats/weekly-pie'),
  monthHeatmap: () => apiRequest<HeatmapItem[]>('/stats/month-heatmap'),

  reports: () => apiRequest<AiReport[]>('/ai/reports'),
  generateReport: () =>
    apiRequest<AiReport>('/ai/reports/generate', { method: 'POST' }),
};
