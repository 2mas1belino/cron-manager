namespace CronManager.Api.Models;

public class CronJob
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Uri { get; set; } = default!;
    public string HttpMethod { get; set; } = "POST";
    public string? Body { get; set; }
    public string Schedule { get; set; } = default!;
    public string TimeZone { get; set; } = "UTC";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string Status { get; set; } = "active";
}