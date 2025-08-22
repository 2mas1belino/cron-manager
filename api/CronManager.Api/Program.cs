using Quartz;
using CronManager.Api.Models;
using CronManager.Api.Services;
using CronManager.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

// Register InMemoryJobStore for DI
builder.Services.AddSingleton<InMemoryJobStore>(sp =>
{
    var scheduler = sp.GetRequiredService<ISchedulerFactory>().GetScheduler().Result;
    return new InMemoryJobStore(scheduler);
});

// Add Quartz
builder.Services.AddQuartz();

// Quartz hosted service (keeps scheduler alive)
builder.Services.AddQuartzHostedService(opt =>
{
    opt.WaitForJobsToComplete = true;
});

var app = builder.Build();

app.MapCronEndpoints();

// Optional root test endpoint
app.MapGet("/", () => "Cron Manager API is running!");

app.MapPost("/test-job", async (HttpContext ctx) =>
{
    using var reader = new StreamReader(ctx.Request.Body);
    var body = await reader.ReadToEndAsync();
    Console.WriteLine($"[{DateTime.UtcNow}] Received job payload: {body}");
    return Results.Ok();
});

app.Run();
