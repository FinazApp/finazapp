using finaz_app.Server.Models;
using finaz_app.Server.Models.DTOs;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para gestionar el registro de nuevos usuarios en el sistema.
    /// </summary>
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

        /// <summary>
        /// Maneja el registro de un nuevo usuario.
        /// </summary>
        /// <param name="request">Objeto de tipo UsuariosDTO que contiene la información del nuevo usuario.</param>
        /// <returns>Devuelve un mensaje de éxito si el registro fue exitoso o un código de error en caso de conflicto o fallo.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Register([FromBody] UsuariosDTO request)
        {
            // Validar el rol
            request.Rol = request.Rol?.ToLower();
            if (!new[] { "usuario", "admin" }.Contains(request.Rol))
            {
                return BadRequest("Rol no identificado");
            }

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

                // Crear un nuevo usuario
                var user = new Usuario
                {
                    Nombre = request.Nombre,
                    CorreoElectronico = request.CorreoElectronico,
                    PasswordHash = passwordHash,
                    Rol = request.Rol,
                    isDeleted = false
                };

                // Agregar el nuevo usuario a la base de datos
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
    }
}
