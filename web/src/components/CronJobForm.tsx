import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { CronJobSchema, type CronJobFormValues } from "../validation/cronJobSchema";
import type { CronJob } from '../types/cron';
import { createJob, updateJob } from '../services/cronService';
import { useNavigate } from 'react-router-dom';

interface Props {
  job?: CronJob;
}

export function CronJobForm({ job }: Props) {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CronJobFormValues>({
    resolver: zodResolver(CronJobSchema),
    defaultValues: {
      uri: job?.uri || "",
      httpMethod: job?.httpMethod || "POST",
      body: job?.body || "",
      schedule: job?.schedule || "",
      timeZone: job?.timeZone || "UTC",
    },
  });

  const onSubmit = async (data: CronJobFormValues) => {
    try {
      if (job) {
        await updateJob({ ...data, id: job.id });
      } else {
        await createJob(data);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4 space-y-4">
  <div>
    <label className="block font-bold mb-1">URI</label>
    <input
      type="text"
      {...register("uri")}
      className="w-full border px-2 py-1 rounded"
    />
    {errors.uri && <p className="text-red-500 text-sm">{errors.uri.message}</p>}
  </div>

  <div>
    <label className="block font-bold mb-1">HTTP Method</label>
    <select {...register("httpMethod")} className="w-full border px-2 py-1 rounded">
      {["GET","POST","PUT","PATCH","DELETE"].map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
    {errors.httpMethod && <p className="text-red-500 text-sm">{errors.httpMethod.message}</p>}
  </div>

  <div>
    <label className="block font-bold mb-1">Body</label>
    <textarea
      {...register("body")}
      className="w-full border px-2 py-1 rounded"
      rows={4}
    />
    {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}
  </div>

  <div>
    <label className="block font-bold mb-1">Schedule (Cron expression)</label>
    <input
      type="text"
      {...register("schedule")}
      placeholder="* * * * * ?"
      className="w-full border px-2 py-1 rounded"
    />
    {errors.schedule && <p className="text-red-500 text-sm">{errors.schedule.message}</p>}
  </div>

  <div>
    <label className="block font-bold mb-1">Time Zone</label>
    <input
      type="text"
      {...register("timeZone")}
      placeholder="UTC"
      className="w-full border px-2 py-1 rounded"
    />
    {errors.timeZone && <p className="text-red-500 text-sm">{errors.timeZone.message}</p>}
  </div>

  <button
    type="submit"
    disabled={isSubmitting}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    {isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
  </button>
</form>
  );
}
