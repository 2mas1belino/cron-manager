import { useEffect, useState } from 'react';
import { fetchJobs } from '../services/cronService';
import type { CronJob } from '../types/cron';

export function JobsList() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs().then(data => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">CRON Jobs</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>URI</th>
            <th>Method</th>
            <th>Schedule</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.uri}</td>
              <td>{job.httpMethod}</td>
              <td>{job.schedule}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
