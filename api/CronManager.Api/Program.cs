using Quartz;
using Quartz.Impl.AdoJobStore;
using Quartz.Spi;
using Microsoft.EntityFrameworkCore;
using CronManager.Api.Services;
using CronManager.Api.Endpoints;
using CronManager.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

// Register InMemoryJobStore for DI
// builder.Services.AddSingleton<InMemoryJobStore>(sp =>
// {
//     var scheduler = sp.GetRequiredService<ISchedulerFactory>().GetScheduler().Result;
//     return new InMemoryJobStore(scheduler);
// });

builder.Services.AddDbContext<CronDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Quartz
builder.Services.AddQuartz(q =>
{
    q.SchedulerName = "CronManagerScheduler";
    q.SchedulerId = "AUTO";
    q.Properties["quartz.serializer.type"] = "newtonsoft";

    q.UsePersistentStore(store =>
    {
        store.UsePostgres(options =>
        {
            options.ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            options.TablePrefix = "qrtz_";
        });
    });
});

// Quartz hosted service (keeps scheduler alive)
builder.Services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);

var app = builder.Build();

app.MapCronEndpoints();

// app.MapGet("/", () => "Cron Manager API is running!");

// app.MapPost("/test-job", async (HttpContext ctx) =>
// {
//     using var reader = new StreamReader(ctx.Request.Body);
//     var body = await reader.ReadToEndAsync();
//     Console.WriteLine($"[{DateTime.UtcNow}] Received job payload: {body}");
//     return Results.Ok();
// });

app.Run();
