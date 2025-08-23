using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// POST endpoint to receive notifications
app.MapPost("/notify", async (HttpContext ctx) =>
{
    using var reader = new StreamReader(ctx.Request.Body);
    var body = await reader.ReadToEndAsync();

    var now = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
    Console.WriteLine($"{now} - {body}");

    await File.AppendAllTextAsync("received.log", $"{now} - {body}{Environment.NewLine}");

    return Results.Ok();
});

app.Run();
