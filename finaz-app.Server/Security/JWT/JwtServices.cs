using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace finaz_app.Server.Security.JWT
{
    public class JwtServices
    {
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Constructor de JwtServices.
        /// </summary>
        /// <param name="configuration">Configuración de la aplicación.</param>
        public JwtServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Genera un token JWT basado en el ID, nombre y rol del usuario.
        /// </summary>
        /// <param name="id">ID del usuario.</param>
        /// <param name="nombre">Nombre del usuario.</param>
        /// <param name="rol">Rol del usuario.</param>
        /// <returns>Token JWT generado.</returns>
        /// <response code="200">Token JWT generado exitosamente.</response>
        public string Generate(int id, string nombre, string rol)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]);
            var symmetricSecurityKey = new SymmetricSecurityKey(key);
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            rol = rol.ToLower();

            // Crear los claims basados en el usuario
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Name, nombre),
                new Claim("role", rol),
                new Claim(JwtRegisteredClaimNames.Sub, id.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
