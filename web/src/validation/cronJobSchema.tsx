import { z } from "zod";
import cronValidator from "cron-expression-validator";

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
}).superRefine((data, ctx) => {
  const result = cronValidator.isValidCronExpression(data.schedule, { error: true });
  //console.log("Validating CRON expression:", data.schedule, "-> isValid:", result.isValid);

  if (!result.isValid && result.errorMessage) {
    const messages = Array.isArray(result.errorMessage)
      ? result.errorMessage
      : [String(result.errorMessage)];
    
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["schedule"],
      message: messages.join("; "),
    });
  }
});

export type CronJobFormValues = z.infer<typeof CronJobSchema>;
