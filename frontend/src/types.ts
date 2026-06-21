export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  userId: string;
};

export type BlocklistItem = {
  id: string;
  url: string;
  categoryId: string;
  userId: string;
  category: Category;
};

export type Session = {
  id: string;
  startTime: string;
  endTime: string | null;
  userId: string;
};

export type TimeLog = {
  id: string;
  url: string;
  duration: number;
  sessionId: string | null;
  categoryId: string | null;
  userId: string;
  createdAt: string;
  category: Category | null;
  session: Session | null;
};

export type WeeklyPieItem = {
  name: string;
  color: string;
  totalSeconds: number;
};

export type HeatmapItem = {
  date: string;
  totalSeconds: number;
};

export type AiReport = {
  id: string;
  feedback: string;
  userId: string;
  createdAt: string;
};

export type CreateCategoryInput = {
  name: string;
  color: string;
};

export type SaveLogInput = {
  url: string;
  duration: number;
  categoryId?: string;
};
