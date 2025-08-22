using Quartz;
using CronManager.Api.Models;
using CronManager.Api.Services;
using CronManager.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Register InMemoryJobStore for DI
builder.Services.AddSingleton<InMemoryJobStore>();

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

app.Run();
