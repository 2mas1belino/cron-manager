import { z } from "zod";

export const CronJobSchema = z.object({
  uri: z.string().url("Invalid URL format (must start with http:// or https://)"),
  httpMethod: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional().refine((val) => {
    if (!val) return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Body must be valid JSON" }),
  schedule: z.string().min(1, "Schedule is required"),
  timeZone: z.string().min(1, "Time zone is required"),
});

export type CronJobFormValues = z.infer<typeof CronJobSchema>;