using finaz_app.Server.Models;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace finaz_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly FinanzAppContext _appContext;
        private readonly JwtServices _jwtServices;

        public RegisterController(FinanzAppContext appContext, JwtServices jwtServices)
        {
            _appContext = appContext;
            _jwtServices = jwtServices;
        }

        [HttpPost("Registrar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Usuario>> Register([FromBody] Usuario request)
        {
            // Validar el rol
            request.Rol = request.Rol?.ToLower();
            if (!new[] { "usuario", "admin" }.Contains(request.Rol))
            {
                return BadRequest("Rol no identificado");
            }

            // Validar que los campos requeridos no estén vacíos
            if (string.IsNullOrWhiteSpace(request.Nombre) || string.IsNullOrWhiteSpace(request.Correo) || string.IsNullOrWhiteSpace(request.PasswordHash))
            {
                return BadRequest("Todos los campos son requeridos.");
            }

            // Validar el formato del correo electrónico (puedes usar una regex más avanzada)
            if (!new EmailAddressAttribute().IsValid(request.Correo))
            {
                return BadRequest("El correo electrónico no es válido.");
            }

            try
            {
                // Verificar si el usuario ya existe
                var existingUser = await _appContext.Usuarios.FirstOrDefaultAsync(u => u.Nombre == request.Nombre);
                if (existingUser != null)
                {
                    return Conflict("El nombre de usuario ya está en uso.");
                }

                // Hashear la contraseña
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);

                // Crear un nuevo usuario
                var user = new Usuario
                {
                    Nombre = request.Nombre,
                    Correo = request.Correo,
                    PasswordHash = passwordHash,
                    Rol = request.Rol
                };

                // Agregar el nuevo usuario a la base de datos
                _appContext.Usuarios.Add(user);
                await _appContext.SaveChangesAsync();

                return Ok(new { message = "Usuario registrado exitosamente" });
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx)
            {
                // Aquí puedes verificar el número de error específico de SQL Server
                if (sqlEx.Number == 2627) // 2627 es el código de error para Unique Constraint Violation
                {
                    return Conflict($"El correo electrónico ya está en uso.");
                }

                // Manejo de otro tipo de excepciones de base de datos
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error guardando los cambios en la base de datos: {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                // Captura el mensaje de la InnerException si está disponible
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error guardando los cambios en la base de datos: {ex.Message}. Detalle: {innerExceptionMessage}");
            }
            catch (Exception ex)
            {
                // Captura el mensaje de la InnerException si está disponible
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Ocurrió un error al registrar el usuario: {ex.Message}. Detalle: {innerExceptionMessage}");
            }

        }
    }
}
