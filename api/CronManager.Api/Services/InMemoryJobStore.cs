using CronManager.Api.Models;
using Quartz;
using Quartz.Xml.JobSchedulingData20;
using System;
using System.Collections.Generic;

namespace CronManager.Api.Services
{
    public class InMemoryJobStore
    {
        // Private dictionary to hold jobs
        private readonly Dictionary<Guid, CronJob> _jobs = new();
        
        public void Add(CronJob job)
        {
            _jobs[job.Id] = job;
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

        public void Update(CronJob job)
        {
            if (_jobs.ContainsKey(job.Id))
            {
                _jobs[job.Id] = job;
            }
            else
            {
                throw new KeyNotFoundException($"CronJob with Id {job.Id} not found.");
            }
        }

        public void Delete(Guid id)
        {
            if (_jobs.ContainsKey(id))
            {
                _jobs.Remove(id);
            }
            else
            {
                throw new KeyNotFoundException($"CronJob with Id {id} not found.");
            }
        }
    }
}


