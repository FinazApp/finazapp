namespace finaz_app.Server.Security
{
    public static class CorsConfig
    {
        public static void AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });
            });

        }

        public static void UseCorsConfiguration(this IApplicationBuilder app)
        {
            app.UseCors();
        }
    }
}
