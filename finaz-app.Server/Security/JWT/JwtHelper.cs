using System.IdentityModel.Tokens.Jwt;

namespace finaz_app.Server.Security.JWT
{
    public class JwtHelper
    {
        public static int? ObtenerIdDeJwt(HttpContext httpContext)
        {
            if (!httpContext.Request.Cookies.TryGetValue("JWT", out var jwtCookie) || string.IsNullOrEmpty(jwtCookie))
            {
                return null;
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadToken(jwtCookie) as JwtSecurityToken;

                if (token == null)
                {
                    return null;
                }

                var idToken = token.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

                if (string.IsNullOrEmpty(idToken) || !int.TryParse(idToken, out var userId))
                {
                    return null;
                }

                return userId;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string? ObtenerRolDeJwt(HttpContext httpContext)
        {
            if (!httpContext.Request.Cookies.TryGetValue("JWT", out var jwtCookie) || string.IsNullOrEmpty(jwtCookie))
            {
                return null;
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadToken(jwtCookie) as JwtSecurityToken;

                if (token == null)
                {
                    return null;
                }

                var role = token.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

                if (string.IsNullOrEmpty(role))
                {
                    return null;
                }

                return role;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
