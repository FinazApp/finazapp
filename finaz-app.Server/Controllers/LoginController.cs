using finaz_app.Server.Models;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para manejar la autenticación de usuarios mediante inicio de sesión.
    /// </summary>
    /// <remarks>
    /// Este controlador permite que los usuarios se autentiquen en el sistema, verificando sus credenciales
    /// y generando un token JWT para las sesiones autenticadas.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly JwtServices _jwtServices;

        /// <summary>
        /// Constructor del LoginController.
        /// </summary>
        /// <param name="context">El contexto de la base de datos de FinanzApp.</param>
        /// <param name="jwtServices">Servicio para generar y gestionar tokens JWT.</param>
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
        /// <response code="200">Inicio de sesión exitoso, se genera y almacena un JWT en las cookies.</response>
        /// <response code="400">Datos de inicio de sesión inválidos o vacíos.</response>
        /// <response code="401">Credenciales incorrectas.</response>
        /// <response code="500">Error interno del servidor durante el proceso de autenticación.</response>
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> Login([FromBody] Login request)
        {
            // Validación de entrada
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.HashContraseña))
            {
                return BadRequest("Los datos de inicio de sesión no pueden estar vacíos.");
            }

            try
            {
                // Buscando al usuario
                var user = await _context.Usuarios.SingleOrDefaultAsync(u => u.Correo == request.Email);

                // Verifica si el usuario existe
                if (user == null)
                {
                    return Unauthorized("Usuario o contraseña incorrecta/o.");
                }

                // Verifica la contraseña
                if (!BCrypt.Net.BCrypt.Verify(request.HashContraseña, user.PasswordHash))
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

                return Ok(new { message = "Inicio de sesión exitoso" });
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
