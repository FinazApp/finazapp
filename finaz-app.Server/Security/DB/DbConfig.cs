using finaz_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace finaz_app.Server.Security.DB
{
    public static class DbConfig
    {
        public static void AddDbConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("AppConnection");
            services.AddDbContext<FinanzAppContext>(options => options.UseSqlServer(connectionString));
        }
    }
}
