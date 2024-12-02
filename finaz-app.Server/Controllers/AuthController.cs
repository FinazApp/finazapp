using finaz_app.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using finaz_app.Server.Security.JWT;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para gestionar el registro de nuevos usuarios en el sistema.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly FinanzAppContext _appContext;
        private readonly JwtServices _jwtServices;

        public AuthController(FinanzAppContext appContext, JwtServices jwtServices)
        {
            _appContext = appContext;
            _jwtServices = jwtServices;
        }

        /// <summary>
        /// Maneja el registro de un nuevo usuario.
        /// </summary>
        /// <param name="request">Objeto de tipo UsuariosDTO que contiene la información del nuevo usuario.</param>
        /// <returns>Devuelve un mensaje de éxito si el registro fue exitoso o un código de error en caso de conflicto o fallo.</returns>
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Register([FromBody] Usuario request)
        {
            // Validar que los campos requeridos no estén vacíos
            if (string.IsNullOrWhiteSpace(request.Nombre) ||
                string.IsNullOrWhiteSpace(request.CorreoElectronico) ||
                string.IsNullOrWhiteSpace(request.PasswordHash))
            {
                return BadRequest("Todos los campos son requeridos.");
            }

            // Validar el formato del correo electrónico
            if (!new EmailAddressAttribute().IsValid(request.CorreoElectronico))
            {
                return BadRequest("El correo electrónico no es válido.");
            }

            try
            {
                // Verificar si el usuario ya existe
                var existingUser = await _appContext.Usuarios
                    .FirstOrDefaultAsync(u => u.CorreoElectronico == request.CorreoElectronico);
                if (existingUser != null)
                {
                    return Conflict("El correo electrónico ya está en uso.");
                }

                // Hashear la contraseña
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);

                var user = new Usuario
                {
                    Nombre = request.Nombre,
                    CorreoElectronico = request.CorreoElectronico,
                    PasswordHash = passwordHash,
                    Rol = "User"
                };

                _appContext.Usuarios.Add(user);
                await _appContext.SaveChangesAsync();

                return Ok(new { message = "Usuario registrado exitosamente" });
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx)
            {
                if (sqlEx.Number == 2627)
                {
                    return Conflict($"El correo electrónico ya está en uso.");
                }

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error guardando los cambios en la base de datos: {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error guardando los cambios en la base de datos: {ex.Message}. Detalle: {innerExceptionMessage}");
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Ocurrió un error al registrar el usuario: {ex.Message}. Detalle: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Maneja el inicio de sesión de un usuario.
        /// </summary>
        /// <param name="request">Objeto Login que contiene las credenciales del usuario.</param>
        /// <returns>Devuelve un mensaje de éxito si el inicio de sesión es correcto o un código de error en caso contrario.</returns>
        [HttpPost("Login")]
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
                var user = await _appContext.Usuarios
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

        /// <summary>
        /// Maneja el cierre de sesión de un usuario.
        /// </summary>
        /// <returns>Devuelve un mensaje de éxito al cerrar sesión correctamente.</returns>
        [HttpPost("Logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Logout()
        {
            try
            {
                // Elimina la cookie JWT
                Response.Cookies.Delete("JWT");

                return Ok(new { message = "Cierre de sesión exitoso" });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Ocurrió un error al cerrar sesión: {ex.Message}");
            }
        }



    }
}
