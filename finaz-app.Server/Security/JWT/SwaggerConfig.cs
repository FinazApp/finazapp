using Microsoft.OpenApi.Models;

namespace finaz_app.Server.Security.JWT
{
    /// <summary>
    /// Proporciona configuraciones para Swagger en la aplicación.
    /// </summary>
    public static class SwaggerConfig
    {
        /// <summary>
        /// Agrega la configuración de Swagger a la colección de servicios.
        /// </summary>
        /// <param name="services">La colección de servicios donde se agregará la configuración de Swagger.</param>
        public static void AddSwaggerConfiguration(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                // Documentación de la API
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Finances APP" });

                // Configuración de JWT para Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer token\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer"
                });

                var securityScheme = new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };

                var securityRequirement = new OpenApiSecurityRequirement
                {
                    { securityScheme, new string[] { } }
                };

                // Agrega la seguridad a la documentación de Swagger
                c.AddSecurityRequirement(securityRequirement);
            });
        }

        /// <summary>
        /// Configura la interfaz de usuario de Swagger.
        /// </summary>
        /// <param name="app">El pipeline de la aplicación donde se configurará Swagger UI.</param>
        public static void UseSwaggerUIConfiguration(this IApplicationBuilder app)
        {
            // Habilita Swagger y la interfaz de usuario de Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Finances app v2");
            });
        }
    }
}
