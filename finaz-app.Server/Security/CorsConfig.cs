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
                    /// Permite una lista de origen en las solicitudes CORS.
                    /// </summary>
                    builder.WithOrigins("http://127.0.0.1:3000", "https://localhost:3000",
                        "http://localhost:80",
                            "http://localhost:443",
                            "http://localhost:4000",
                            "http://localhost:5000",
                            "http://localhost:8000",
                            "http://localhost:8080");

                    /// <summary>
                    /// Habilita el envío de credenciales de autenticación en las solicitudes HTTP. Esto permite que las credenciales (como cookies o autenticación básica) sean enviadas en el encabezado (header) de las solicitudes.
                    /// </summary>
                    builder.AllowCredentials();
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
