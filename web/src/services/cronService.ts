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

// TODO: updateJob, deleteJob, pauseJob, resumeJob