using Quartz;
using Quartz.Impl;
using Quartz.Spi;

var builder = WebApplication.CreateBuilder(args);

// Add Quartz
builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();
});

// Quartz hosted service (keeps scheduler alive)
builder.Services.AddQuartzHostedService(opt =>
{
    opt.WaitForJobsToComplete = true;
});

var app = builder.Build();

app.MapGet("/", () => "Cron Manager API is running!");

// Example endpoint to trigger a test job
app.MapGet("/test-job", async (ISchedulerFactory schedulerFactory) =>
{
    var scheduler = await schedulerFactory.GetScheduler();

    var job = JobBuilder.Create<HelloJob>()
        .WithIdentity("hello-job", "test")
        .Build();

    var trigger = TriggerBuilder.Create()
        .WithIdentity("hello-trigger", "test")
        .StartNow()
        .WithSimpleSchedule(x => x.WithIntervalInSeconds(10).RepeatForever())
        .Build();

    await scheduler.ScheduleJob(job, trigger);

    return "Scheduled HelloJob every 10s!";
});

app.Run();

public class HelloJob : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine($"[{DateTime.Now}] Hello from Quartz Job!");
        return Task.CompletedTask;
    }
}
