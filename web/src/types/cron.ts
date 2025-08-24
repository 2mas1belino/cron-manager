export interface CronJob {
  id: string;
  uri: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body: string;
  schedule: string;
  timeZone: string;
  status: 'active' | 'paused';
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
}