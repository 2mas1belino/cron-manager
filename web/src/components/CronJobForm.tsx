import React, { useState } from 'react';
import type { CronJob } from '../types/cron';
import { createJob, updateJob } from '../services/cronService';
import { useNavigate } from 'react-router-dom';

interface Props {
  job?: CronJob;
}

export function CronJobForm({ job }: Props) {
  const [uri, setUri] = useState(job?.uri || '');
  const [httpMethod, setHttpMethod] = useState<'GET'|'POST'|'PUT'|'PATCH'|'DELETE'>(job?.httpMethod || 'POST');
  const [body, setBody] = useState(job?.body || '');
  const [schedule, setSchedule] = useState(job?.schedule || '');
  const [timeZone, setTimeZone] = useState(job?.timeZone || 'UTC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cronJobData: Partial<CronJob> = {
      id: job?.id,
      uri,
      httpMethod,
      body,
      schedule,
      timeZone
    };

    try {
      if (job) {
        await updateJob(cronJobData);
      } else {
        await createJob(cronJobData);
      }
      navigate('/dashboard');
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

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block font-bold mb-1">URI</label>
        <input
          type="text"
          value={uri}
          onChange={e => setUri(e.target.value)}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">HTTP Method</label>
        <select
          value={httpMethod}
          onChange={e => setHttpMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')}
          className="w-full border px-2 py-1 rounded"
        >
          {['GET','POST','PUT','PATCH','DELETE'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-bold mb-1">Body</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          rows={4}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Schedule (Cron expression)</label>
        <input
          type="text"
          value={schedule}
          onChange={e => setSchedule(e.target.value)}
          required
          className="w-full border px-2 py-1 rounded"
          placeholder="* * * * * ?"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Time Zone</label>
        <input
          type="text"
          value={timeZone}
          onChange={e => setTimeZone(e.target.value)}
          required
          className="w-full border px-2 py-1 rounded"
          placeholder="UTC"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
}
