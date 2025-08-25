import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchJobs,
  runJob,
  pauseJob,
  resumeJob,
  deleteJob,
} from "../services/cronService";
import { CronJobCard } from "../components/CronJobCard";
import type { CronJob } from "../types/cron";
import { Separator } from "@/components/ui/separator"
// import { ModeToggle } from "@/components/shadcn/mode-toggle";

export function Dashboard() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRun = async (id: string) => {
    await runJob(id);
    loadJobs();
  };
  const handlePause = async (id: string) => {
    await pauseJob(id);
    loadJobs();
  };
  const handleResume = async (id: string) => {
    await resumeJob(id);
    loadJobs();
  };
  const handleDelete = async (id: string) => {
    await deleteJob(id);
    loadJobs();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-start justify-between my-3">
        <h2 className="text-xl font-bold ml-3">CRON jobs manager</h2>
        {/* <div className="mr-3">
          <ModeToggle></ModeToggle>
        </div> */}
      </div>
      <Separator />
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Jobs</h2>
          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 bg-primary rounded"
          >
            New Job
          </button>
        </div>

        {jobs.map((job) => (
          <CronJobCard
            key={job.id}
            job={job}
            onRun={handleRun}
            onPause={handlePause}
            onResume={handleResume}
            onDelete={handleDelete}
            onEdit={() => navigate(`/edit/${job.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
