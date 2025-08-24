import { useEffect, useState } from 'react';
import { fetchJobs, runJob, pauseJob, resumeJob, deleteJob } from '../services/cronService';
import { CronJobCard } from '../components/CronJobCard';
import type { CronJob } from '../types/cron';

export function Dashboard() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRun = async (id: string) => { await runJob(id); loadJobs(); };
  const handlePause = async (id: string) => { await pauseJob(id); loadJobs(); };
  const handleResume = async (id: string) => { await resumeJob(id); loadJobs(); };
  const handleDelete = async (id: string) => { await deleteJob(id); loadJobs(); };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cron Jobs Dashboard</h1>
      {jobs.map(job => (
        <CronJobCard
          key={job.id}
          job={job}
          onRun={handleRun}
          onPause={handlePause}
          onResume={handleResume}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}