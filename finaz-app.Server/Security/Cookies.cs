using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.CookiePolicy;

namespace finaz_app.Server.Security
{
    /// <summary>
    /// Proporciona configuraciones para el manejo de cookies en la aplicación.
    /// </summary>
    public static class Cookies
    {
        /// <summary>
        /// Configura las opciones de las cookies para la aplicación.
        /// </summary>
        /// <param name="app">El pipeline de la aplicación donde se configurarán las cookies.</param>
        public static void UseCookiesConfiguration(this IApplicationBuilder app)
        {
            app.UseCookiePolicy(new CookiePolicyOptions
            {
                /// <summary>
                /// Establece la política de SameSite para las cookies. 
                /// Al usar None, permite que las cookies se envíen en solicitudes de sitios cruzados.
                /// </summary>
                MinimumSameSitePolicy = SameSiteMode.None,

                /// <summary>
                /// Especifica que las cookies deben ser accesibles únicamente a través de HTTP, 
                /// lo que ayuda a prevenir ataques de scripting entre sitios (XSS).
                /// </summary>
                HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always,

                /// <summary>
                /// Indica que las cookies solo se deben enviar a través de conexiones seguras (HTTPS).
                /// </summary>
                Secure = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always,
            });
        }
    }
}
