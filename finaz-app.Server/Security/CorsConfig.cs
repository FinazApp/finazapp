using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace finaz_app.Server.Security
{
    /// <summary>
    /// Proporciona configuraciones para el manejo de CORS en la aplicación.
    /// </summary>
    public static class CorsConfig
    {
        /// <summary>
        /// Agrega la configuración de CORS a los servicios de la aplicación.
        /// </summary>
        /// <param name="services">La colección de servicios a la que se agregará la configuración de CORS.</param>
        public static void AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    /// <summary>
                    /// Permite cualquier encabezado en las solicitudes CORS.
                    /// </summary>
                    builder.AllowAnyHeader();

                    /// <summary>
                    /// Permite cualquier método (GET, POST, PUT, DELETE, etc.) en las solicitudes CORS.
                    /// </summary>
                    builder.AllowAnyMethod();

                    /// <summary>
                    /// Permite cualquier origen en las solicitudes CORS.
                    /// </summary>
                    builder.AllowAnyOrigin();
                });
            });
        }

        /// <summary>
        /// Aplica la configuración de CORS al pipeline de la aplicación.
        /// </summary>
        /// <param name="app">El pipeline de la aplicación donde se aplicará la configuración de CORS.</param>
        public static void UseCorsConfiguration(this IApplicationBuilder app)
        {
            app.UseCors();
        }
    }
}
