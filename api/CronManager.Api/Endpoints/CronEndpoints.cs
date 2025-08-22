using CronManager.Api.Models;
using CronManager.Api.Services;

namespace CronManager.Api.Endpoints
{
    public static class CronEndpoints
    {
        public static void MapCronEndpoints(this WebApplication app)
        {
            app.MapPost("/api/crons", (CronJob job, InMemoryJobStore store) =>
            {
                store.Add(job);
                return Results.Created($"/api/crons/{job.Id}", job);
            });

            app.MapGet("/api/crons", (InMemoryJobStore store) =>
            {
                var jobs = store.GetAll();
                return Results.Ok(jobs);
            });

            app.MapGet("/api/crons/{id}", (Guid id, InMemoryJobStore store) =>
            {
                try
                {
                    var job = store.GetById(id);
                    return Results.Ok(job);
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });

            app.MapPut("/api/crons/{id}", (Guid id, CronJob job, InMemoryJobStore store) =>
            {
                if (id != job.Id)
                    return Results.BadRequest("Id in route does not match Id in body.");

                try
                {
                    store.Update(job);
                    return Results.NoContent();
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });

            app.MapDelete("/api/crons/{id}", (Guid id, InMemoryJobStore store) =>
            {
                try
                {
                    store.Delete(id);
                    return Results.NoContent();
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });
        }
    }
}