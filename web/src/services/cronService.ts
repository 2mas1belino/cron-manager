import type { CronJob } from '../types/cron';

const API_BASE = 'http://localhost:5190/api/crons';

export async function fetchJobs(): Promise<CronJob[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function createJob(job: Partial<CronJob>): Promise<CronJob> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error('Failed to create job');
  return res.json();
}

export async function updateJob(id: string, job: Partial<CronJob>): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error('Failed to update job');
}

export async function runJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/run`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to run job');
}

export async function pauseJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/pause`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to pause job');
}

export async function resumeJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/resume`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to resume job');
}

export async function deleteJob(id: string): Promise<void>{
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete job');
}