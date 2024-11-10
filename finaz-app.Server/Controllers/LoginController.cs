using finaz_app.Server.Models;
using finaz_app.Server.Models.DTOs;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para manejar la autenticación de usuarios mediante inicio de sesión.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly JwtServices _jwtServices;

        /// <summary>
        /// Constructor del LoginController.
        /// </summary>
        public LoginController(FinanzAppContext context, JwtServices jwtServices)
        {
            _context = context;
            _jwtServices = jwtServices;
        }

        /// <summary>
        /// Maneja el inicio de sesión de un usuario.
        /// </summary>
        /// <param name="request">Objeto Login que contiene las credenciales del usuario.</param>
        /// <returns>Devuelve un mensaje de éxito si el inicio de sesión es correcto o un código de error en caso contrario.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> Login([FromBody] Login request)
        {
            // Validación de entrada
            if (request == null || string.IsNullOrWhiteSpace(request.CorreoElectronico) || string.IsNullOrWhiteSpace(request.PasswordHash))
            {
                return BadRequest("Los datos de inicio de sesión no pueden estar vacíos.");
            }

            try
            {
                // Buscando al usuario
                var user = await _context.Usuarios
                    .Where(u => u.CorreoElectronico == request.CorreoElectronico)
                    .SingleOrDefaultAsync();

                // Verifica si el usuario existe
                if (user == null)
                {
                    return Unauthorized("Usuario o contraseña incorrecta/o.");
                }

                // Verifica la contraseña
                if (!BCrypt.Net.BCrypt.Verify(request.PasswordHash, user.PasswordHash))
                {
                    return Unauthorized("Usuario o contraseña incorrecta/o.");
                }

                // Generar JWT
                var jwt = _jwtServices.Generate(user.UsuarioId, user.Nombre, user.Rol);

                // Configurar las cookies
                Response.Cookies.Append("JWT", jwt, new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTimeOffset.UtcNow.AddDays(1),
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    IsEssential = true
                });

                // Retornar el DTO del usuario autenticado
                var userDto = new UsuariosDTO
                {
                    UsuarioId = user.UsuarioId,
                    Nombre = user.Nombre,
                    CorreoElectronico = user.CorreoElectronico,
                    PasswordHash = user.PasswordHash
                };

                return Ok(new { message = "Inicio de sesión exitoso", user = userDto });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Error al acceder a la base de datos: {dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Ocurrió un error al iniciar sesión: {ex.Message}");
            }
        }
    }
}
