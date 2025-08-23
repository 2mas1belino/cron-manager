using CronManager.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CronManager.Api.Data
{
    public class CronDbContext : DbContext
    {
        public CronDbContext(DbContextOptions<CronDbContext> options)
            : base(options)
        {
        }

        public DbSet<CronJob> CronJobs { get; set; } = null!;
    }
}
