using CronManager.Api.Models;
using CronManager.Api.Services;

namespace CronManager.Api.Endpoints
{
    public static class CronEndpoints
    {
        public static void MapCronEndpoints(this WebApplication app)
        {
            app.MapPost("/api/crons", async (CronJob job, InMemoryJobStore store) =>
            {
                await store.AddAsync(job);
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

            app.MapPut("/api/crons/{id}", async (Guid id, CronJob job, InMemoryJobStore store) =>
            {
                if (id != job.Id)
                    return Results.BadRequest("Id in route does not match Id in body.");

                try
                {
                    await store.UpdateAsync(job);
                    return Results.NoContent();
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });

            app.MapPost("/api/crons/{id}/run", async (Guid id, InMemoryJobStore store) =>
            {
                try
                {
                    await store.RunNowAsync(id);
                    return Results.Ok();
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });

            app.MapPatch("/api/crons/{id}/pause", async (Guid id, InMemoryJobStore store) =>
            {
                try
                {
                    await store.PauseAsync(id);
                    return Results.NoContent();
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });

            app.MapPatch("/api/crons/{id}/resume", async (Guid id, InMemoryJobStore store) =>
            {
                try
                {
                    await store.ResumeAsync(id);
                    return Results.NoContent();
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            });

            app.MapDelete("/api/crons/{id}", async (Guid id, InMemoryJobStore store) =>
            {
                try
                {
                    await store.DeleteAsync(id);
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