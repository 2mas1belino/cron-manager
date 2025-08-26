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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "../components/PageHeader";

export function Dashboard() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

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

  const filteredJobs = jobs.filter((job) => {
    const statusMatch = statusFilter === "all" || job.status === statusFilter;
    const methodMatch =
      methodFilter === "all" || job.httpMethod === methodFilter;
    return statusMatch && methodMatch;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <PageHeader title="CRON jobs manager"></PageHeader>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Jobs</h2>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 bg-primary rounded"
          >
            New Job
          </button>
        </div>

        {filteredJobs.map((job) => (
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

        {filteredJobs.length === 0 && (
          <p className="text-gray-400 text-center mt-6">No jobs found.</p>
        )}
      </div>
    </div>
  );
}
