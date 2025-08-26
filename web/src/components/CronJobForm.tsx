import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { CronJobSchema, type CronJobFormValues } from "../validation/cronJobSchema";
import type { CronJob } from '../types/cron';
import { createJob, updateJob } from '../services/cronService';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  job?: CronJob;
}

export function CronJobForm({ job }: Props) {
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CronJobFormValues>({
    resolver: zodResolver(CronJobSchema),
    defaultValues: {
      uri: job?.uri || "",
      httpMethod: job?.httpMethod || "POST",
      body: job?.body || "",
      schedule: job?.schedule || "",
      timeZone: job?.timeZone || "UTC",
    },
  });

  const timeZones = Intl.supportedValuesOf?.('timeZone') || [
    'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'
  ];

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
    <Controller
      name="httpMethod"
      control={control}
      render={({ field }) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select HTTP method" />
          </SelectTrigger>
          <SelectContent>
            {["GET","POST","PUT","PATCH","DELETE"].map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {errors.httpMethod && (<p className="text-red-500 text-sm">{errors.httpMethod.message}</p>)}
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
      className="w-full border px-2 py-1 rounded"
    />
    {errors.schedule && <p className="text-red-500 text-sm">{errors.schedule.message}</p>}
  </div>

  <div>
  <label className="block font-bold mb-1">Time Zone</label>
  <Controller
    name="timeZone"
    control={control}
    render={({ field }) => (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Time Zone" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto">
          {timeZones.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  />
  {errors.timeZone && (
    <p className="text-red-500 text-sm">{errors.timeZone.message}</p>
  )}
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
