import type { CronJob } from "../types/cron";

interface Props {
  job: CronJob;
  onRun: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: () => void;
}

export function CronJobCard({
  job,
  onRun,
  onPause,
  onResume,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-md p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg"><span className="font-semibold text-gray-400">URI: </span>{job.uri}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            job.status === "active" ? "bg-purple-600" : "bg-gray-700"
          }`}
        >
          {job.status.toUpperCase()}
        </span>
      </div>

      {/* Schedule & Command */}
      <div className="text-sm">
        <p>
          <span className="font-medium text-gray-400 mb-2">Schedule:</span> {job.schedule}
        </p>
        <p>
          <span className="font-medium text-gray-400 mb-2">Body:</span> {job.body}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap mt-4">
        <button
          onClick={() => onRun(job.id)}
          className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
        >
          Run
        </button>
        {job.status === "active" ? (
          <button
            onClick={() => onPause(job.id)}
            className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => onResume(job.id)}
            className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
          >
            Resume
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(job.id)}
          className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
