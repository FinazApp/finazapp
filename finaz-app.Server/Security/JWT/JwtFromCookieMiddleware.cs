namespace finaz_app.Server.Security.JWT
{
    public class JwtFromCookieMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtFromCookieMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Intenta obtener el JWT de las cookies
            if (context.Request.Cookies.TryGetValue("jwt", out var jwt))
            {
                // Asegúrate de que no esté ya en el header
                if (!context.Request.Headers.ContainsKey("Authorization"))
                {
                    context.Request.Headers["Authorization"] = $"Bearer {jwt}";
                }
            }

            // Continuar con la solicitud
            await _next(context);
        }
    }
}
