using Quartz;
using CronManager.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CronManager.Api.Services
{
    public class InMemoryJobStore
    {
        private readonly Dictionary<Guid, CronJob> _jobs = new(); // Private dictionary to hold jobs
        private readonly IScheduler _scheduler;

        public InMemoryJobStore(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }

        public async Task AddAsync(CronJob job)
        {
            _jobs[job.Id] = job;

            // Create Quartz job and trigger
            var quartzJob = JobBuilder.Create<HttpNotifyJob>()
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

            await _scheduler.ScheduleJob(quartzJob, trigger);
        }

        public IEnumerable<CronJob> GetAll()
        {
            return _jobs.Values;
        }

        public CronJob? GetById(Guid id)
        {
            if (_jobs.TryGetValue(id, out var job))
                return job;

            return null;
        }

        public async Task UpdateAsync(CronJob job)
        {
            if (!_jobs.ContainsKey(job.Id))
                throw new KeyNotFoundException($"CronJob with Id {job.Id} not found.");

            // Unschedule old job
            await _scheduler.DeleteJob(new JobKey(job.Id.ToString()));

            // Update in dictionary
            _jobs[job.Id] = job;

            // Schedule new Quartz job
            var quartzJob = JobBuilder.Create<HttpNotifyJob>()
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

            await _scheduler.ScheduleJob(quartzJob, trigger);
        }

        public async Task DeleteAsync(Guid id)
        {
            if (!_jobs.ContainsKey(id))
                throw new KeyNotFoundException($"CronJob with Id {id} not found.");

            // Unschedule Quartz job
            await _scheduler.DeleteJob(new JobKey(id.ToString()));

            // Remove from dictionary
            _jobs.Remove(id);
        }

        public async Task RunNowAsync(Guid id)
        {
            if (!_jobs.ContainsKey(id))
                throw new KeyNotFoundException($"CronJob with Id {id} not found.");

            await _scheduler.TriggerJob(new JobKey(id.ToString()));
        }

        public async Task PauseAsync(Guid id)
        {
            if (!_jobs.ContainsKey(id))
                throw new KeyNotFoundException($"CronJob with Id {id} not found.");

            await _scheduler.PauseJob(new JobKey(id.ToString()));
        }

        public async Task ResumeAsync(Guid id)
        {
            if (!_jobs.ContainsKey(id))
                throw new KeyNotFoundException($"CronJob with Id {id} not found.");

            await _scheduler.ResumeJob(new JobKey(id.ToString()));
        }
        
        // public void Add(CronJob job)
        // {
        //     _jobs[job.Id] = job;
        // }

        // public void Update(CronJob job)
        // {
        //     if (_jobs.ContainsKey(job.Id))
        //     {
        //         _jobs[job.Id] = job;
        //     }
        //     else
        //     {
        //         throw new KeyNotFoundException($"CronJob with Id {job.Id} not found.");
        //     }
        // }

        // public void Delete(Guid id)
        // {
        //     if (_jobs.ContainsKey(id))
        //     {
        //         _jobs.Remove(id);
        //     }
        //     else
        //     {
        //         throw new KeyNotFoundException($"CronJob with Id {id} not found.");
        //     }
        // }
    }
}


