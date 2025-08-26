import { useEffect, useState } from 'react';
import { CronJobForm } from '../components/CronJobForm';
import { fetchJob } from '../services/cronService';
import { useParams } from 'react-router-dom';
import type { CronJob } from '../types/cron';

export function EditCron() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<CronJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        if (!id) return;
        const data = await fetchJob(id);
        setJob(data);
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
    loadJob();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Cron Job</h1>
      <CronJobForm job={job} />
    </div>
  );
}
