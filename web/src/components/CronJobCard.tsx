import type { CronJob } from '../types/cron';

interface Props {
  job: CronJob;
  onRun: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: () => void; // optional edit callback
}

export function CronJobCard({ job, onRun, onPause, onResume, onDelete, onEdit }: Props) {
  return (
    <div className="border rounded p-4 shadow-sm mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{job.uri}</h3>
        <p className="text-sm text-gray-600">{job.schedule} ({job.timeZone})</p>
        <p className="text-sm">{job.httpMethod} - {job.status}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onRun(job.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Run</button>
        {job.status === 'active' ? (
          <button onClick={() => onPause(job.id)} className="bg-yellow-400 text-white px-2 py-1 rounded">Pause</button>
        ) : (
          <button onClick={() => onResume(job.id)} className="bg-green-500 text-white px-2 py-1 rounded">Resume</button>
        )}
        {onEdit && (
          <button onClick={onEdit} className="bg-indigo-500 text-white px-2 py-1 rounded">Edit</button>
        )}
        <button onClick={() => onDelete(job.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
      </div>
    </div>
  );
}
