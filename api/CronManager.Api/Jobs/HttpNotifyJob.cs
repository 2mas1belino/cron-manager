using Quartz;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class HttpNotifyJob : IJob
{
    private readonly IHttpClientFactory _httpClientFactory;

    public HttpNotifyJob(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        // var client = _httpClientFactory.CreateClient();
        // var jobData = context.MergedJobDataMap;
        // var uri = jobData.GetString("Uri");
        // var body = jobData.GetString("Body");

        // if (!string.IsNullOrEmpty(uri))
        // {
        //     var content = new StringContent(body ?? "", Encoding.UTF8, "application/json");
        //     await client.PostAsync(uri, content);
        //     Console.WriteLine($"[{DateTime.UtcNow}] Sent job to {uri} with body: {body}");
        // }

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

        // Optional: log success/failure
        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine($"Failed notifying {uri}: {response.StatusCode}");
        }
    }
}
