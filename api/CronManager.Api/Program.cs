using Quartz;
using Quartz.Impl.AdoJobStore;
using Quartz.Spi;
using Microsoft.EntityFrameworkCore;
using CronManager.Api.Services;
using CronManager.Api.Endpoints;
using CronManager.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Allow CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Vite dev server
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddHttpClient();

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

        store.UseClustering(clustering =>
        {
            clustering.CheckinInterval = TimeSpan.FromSeconds(20);
        });
    });
});

// Quartz hosted service (keeps scheduler alive)
builder.Services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);

var app = builder.Build();

app.UseCors("AllowFrontend");
app.MapGet("/ping", () => "pong").RequireCors("AllowFrontend");
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
