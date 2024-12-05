using finaz_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace finaz_app.Server.Security.DB
{
    /// <summary>
    /// Proporciona configuraciones de base de datos para la aplicación.
    /// </summary>
    public static class DbConfig
    {
        /// <summary>
        /// Agrega la configuración de la base de datos a la colección de servicios.
        /// </summary>
        /// <param name="services">La colección de servicios donde se agregará la configuración de la base de datos.</param>
        /// <param name="configuration">La configuración de la aplicación que contiene la cadena de conexión.</param>
        public static void AddDbConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            // Obtiene la cadena de conexión desde la configuración
            var connectionString = configuration.GetConnectionString("AppConnection");

            // Configura el contexto de la base de datos utilizando SQL Server
            services.AddDbContext<FinanzAppContext>(options => options.UseSqlServer(connectionString));
        }
    }
}
