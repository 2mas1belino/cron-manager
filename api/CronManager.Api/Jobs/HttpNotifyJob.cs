using Quartz;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class HttpNotifyJob : IJob
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<HttpNotifyJob> _logger;

    public HttpNotifyJob(IHttpClientFactory httpClientFactory, ILogger<HttpNotifyJob> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var schedulerId = context.Scheduler.SchedulerInstanceId; // Quartz instance ID
        var hostName = Environment.MachineName; // Docker container hostname

        var dataMap = context.JobDetail.JobDataMap;
        var uri = dataMap.GetString("Uri")!;
        var method = dataMap.GetString("HttpMethod")!;
        var body = dataMap.GetString("Body") ?? "";

        var client = _httpClientFactory.CreateClient();
        var content = new StringContent(body, Encoding.UTF8, "application/json");

        var request = new HttpRequestMessage(new HttpMethod(method), uri)
        {
            Content = content
        };

        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Failed notifying {Uri}: {StatusCode}", uri, response.StatusCode);
        }

        _logger.LogInformation(
            "Job {JobKey} executed by host: {HostName}, scheduler: {SchedulerId}, status: {StatusCode}",
            context.JobDetail.Key, hostName, schedulerId, response.StatusCode);
    }
}
