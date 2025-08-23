using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CronManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class DropCronJobsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CronJobs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CronJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Uri = table.Column<string>(nullable: true),
                    HttpMethod = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    Schedule = table.Column<string>(nullable: true),
                    TimeZone = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CronJobs", x => x.Id);
                });
        }
    }
}
