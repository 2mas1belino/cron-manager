using Quartz;
using Quartz.Impl.Matchers;
using CronManager.Api.Models;

namespace CronManager.Api.Endpoints
{
    public static class CronEndpoints
    {
        public static void MapCronEndpoints(this WebApplication app)
        {
            // CREATE
            app.MapPost("/api/crons", async (CronJob job, ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();

                var jobDetail = JobBuilder.Create<HttpNotifyJob>()
                    .WithIdentity(job.Id.ToString())
                    .UsingJobData("Uri", job.Uri)
                    .UsingJobData("HttpMethod", job.HttpMethod)
                    .UsingJobData("Body", job.Body)
                    .Build();

                var trigger = TriggerBuilder.Create()
                    .WithIdentity(job.Id.ToString() + "-trigger")
                    .WithCronSchedule(job.Schedule, x => x.InTimeZone(TimeZoneInfo.FindSystemTimeZoneById(job.TimeZone)))
                    .StartNow()
                    .Build();

                await scheduler.ScheduleJob(jobDetail, trigger);

                return Results.Created($"/api/crons/{job.Id}", job);
            });

            // READ ALL
            app.MapGet("/api/crons", async (ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();
                var groups = await scheduler.GetJobGroupNames();
                var jobs = new List<CronJob>();

                foreach (var group in groups)
                {
                    var keys = await scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(group));
                    foreach (var key in keys)
                    {
                        var detail = await scheduler.GetJobDetail(key);
                        var triggers = await scheduler.GetTriggersOfJob(key);
                        var trigger = triggers.FirstOrDefault() as ICronTrigger;

                        if (trigger == null)
                            continue;

                        jobs.Add(new CronJob
                        {
                            Id = Guid.Parse(key.Name),
                            Uri = detail.JobDataMap.GetString("Uri") ?? "",
                            HttpMethod = detail.JobDataMap.GetString("HttpMethod") ?? "GET",
                            Body = detail.JobDataMap.GetString("Body") ?? "",
                            Schedule = trigger.CronExpressionString ?? "",
                            TimeZone = trigger.TimeZone.Id
                        });
                    }
                }

                return Results.Ok(jobs);
            });

            // READ BY ID
            app.MapGet("/api/crons/{id}", async (Guid id, ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();
                var key = new JobKey(id.ToString());
                var detail = await scheduler.GetJobDetail(key);

                if (detail == null)
                    return Results.NotFound();

                var triggers = await scheduler.GetTriggersOfJob(key);
                var trigger = triggers.FirstOrDefault() as ICronTrigger;

                if (trigger == null)
                    return Results.NotFound();

                var job = new CronJob
                {
                    Id = id,
                    Uri = detail.JobDataMap.GetString("Uri") ?? "",
                    HttpMethod = detail.JobDataMap.GetString("HttpMethod") ?? "GET",
                    Body = detail.JobDataMap.GetString("Body") ?? "",
                    Schedule = trigger.CronExpressionString ?? "",
                    TimeZone = trigger.TimeZone.Id
                };

                return Results.Ok(job);
            });

            // UPDATE
            app.MapPut("/api/crons/{id}", async (Guid id, CronJob job,ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();

                if (id != job.Id)
                    return Results.BadRequest("Id in route does not match Id in body.");

                var key = new JobKey(id.ToString());
                if (!await scheduler.CheckExists(key))
                    return Results.NotFound();

                await scheduler.DeleteJob(key);

                var jobDetail = JobBuilder.Create<HttpNotifyJob>()
                    .WithIdentity(job.Id.ToString())
                    .UsingJobData("Uri", job.Uri)
                    .UsingJobData("HttpMethod", job.HttpMethod)
                    .UsingJobData("Body", job.Body)
                    .Build();

                var trigger = TriggerBuilder.Create()
                    .WithIdentity(job.Id.ToString() + "-trigger")
                    .WithCronSchedule(job.Schedule, x => x.InTimeZone(TimeZoneInfo.FindSystemTimeZoneById(job.TimeZone)))
                    .StartNow()
                    .Build();

                await scheduler.ScheduleJob(jobDetail, trigger);

                return Results.NoContent();
            });

            // RUN NOW
            app.MapPost("/api/crons/{id}/run", async (Guid id, ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();
                var key = new JobKey(id.ToString());
                if (await scheduler.CheckExists(key))
                {
                    await scheduler.TriggerJob(key);
                    return Results.Ok();
                }
                return Results.NotFound();
            });

            // PAUSE
            app.MapPatch("/api/crons/{id}/pause", async (Guid id, ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();
                var key = new JobKey(id.ToString());
                if (await scheduler.CheckExists(key))
                {
                    await scheduler.PauseJob(key);
                    return Results.NoContent();
                }
                return Results.NotFound();
            });

            // RESUME
            app.MapPatch("/api/crons/{id}/resume", async (Guid id, ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();
                var key = new JobKey(id.ToString());
                if (await scheduler.CheckExists(key))
                {
                    await scheduler.ResumeJob(key);
                    return Results.NoContent();
                }
                return Results.NotFound();
            });

            // DELETE
            app.MapDelete("/api/crons/{id}", async (Guid id, ISchedulerFactory schedulerFactory) =>
            {
                var scheduler = await schedulerFactory.GetScheduler();
                var key = new JobKey(id.ToString());
                if (await scheduler.CheckExists(key))
                {
                    await scheduler.DeleteJob(key);
                    return Results.NoContent();
                }
                return Results.NotFound();
            });
        }
    }
}