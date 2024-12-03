using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using System.ComponentModel.DataAnnotations;
using finaz_app.Server.Security.JWT;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para gestionar las operaciones CRUD de los usuarios en el sistema.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        public UsuariosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public class UsuarioAction
        {
            public int UsuarioId { get; set; }
            public required string Action { get; set; }
        }

        /// <summary>
        /// Obtiene todos los usuarios.
        /// </summary>
        /// <returns>Devuelve una lista de usuarios en formato DTO.</returns>
        [HttpGet]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(IEnumerable<UsuariosDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<UsuariosDTO>>> GetUsersList()
        {
            try
            {
                var usuarios = await _context.Usuarios.ToListAsync();
                var usuariosDto = _mapper.Map<IEnumerable<UsuariosDTO>>(usuarios);

                return Ok(usuariosDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error en la obtención de datos: {ex.Message}");
            }
        }

        /// <summary>
        /// Promueve o degrada a un usuario de su rol.
        /// </summary>
        [HttpPost("ChangeRole")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> ChangeRole([FromBody] UsuarioAction action)
        {
            try
            {
                // Validar el ID del usuario desde el JWT
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                // Buscar el usuario en la base de datos
                var existingUser = await _context.Usuarios.FindAsync(action.UsuarioId);
                if (existingUser == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                // Validar las acciones y roles
                if (action.Action == "Promote")
                {
                    if (existingUser.Rol == "admin")
                    {
                        return BadRequest("No se puede promover a un usuario que ya es admin.");
                    }
                    existingUser.Rol = "admin";
                }
                else if (action.Action == "Degrade")
                {
                    if (existingUser.Rol == "User")
                    {
                        return BadRequest("No se puede degradar a un usuario que ya tiene el rol de User.");
                    }
                    existingUser.Rol = "User";
                }
                else
                {
                    return BadRequest("La acción especificada no es válida. Use 'Promote' o 'Degrade'.");
                }

                // Marcar el usuario como modificado y guardar cambios
                _context.Entry(existingUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok($"El rol del usuario con ID {action.UsuarioId} se ha actualizado a {existingUser.Rol}.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al procesar la solicitud: {ex.Message}");
            }
        }


        /// <summary>
        /// Obtiene un usuario específico por ID.
        /// </summary>
        /// <returns>Devuelve el usuario en formato DTO.</returns>
        [HttpGet("Me")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(UsuariosDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UsuariosDTO>> GetUsuario()
        {
            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var usuario = await _context.Usuarios
                    .AsNoTracking() // Para optimizar si no se va a modificar el objeto
                    .FirstOrDefaultAsync(u => u.UsuarioId == userID);

                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                var usuariosDto = new UsuariosDTO
                {
                    Rol = usuario.Rol,
                    Nombre = usuario.Nombre,
                    UsuarioId = usuario.UsuarioId,
                    FotoPerfil = usuario.FotoPerfil,
                    CorreoElectronico = usuario.CorreoElectronico,
                };

                return Ok(usuariosDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el usuario: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza un usuario existente.
        /// </summary>
        [HttpPatch]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> PutUsuario(UsuariosDTO request)
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext) ?? 0;
            var userRole = JwtHelper.ObtenerRolDeJwt(HttpContext); // Suponiendo que el rol se puede obtener del JWT.

            try
            {
                if (userID <= 0)
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");

                // Solo el usuario mismo o un administrador pueden realizar cambios
                if (userID != request.UsuarioId && userRole != "admin")
                    return Forbid("No tienes permisos para actualizar este usuario.");

                var existingUser = await _context.Usuarios.FindAsync(request.UsuarioId);
                if (existingUser == null)
                    return NotFound("Usuario no encontrado.");

                // Validar el nombre del usuario
                var nombreExistente = await _context.Usuarios
                    .AnyAsync(u => u.Nombre == request.Nombre && u.UsuarioId != request.UsuarioId);
                if (nombreExistente)
                    return Conflict("El nombre ya está en uso.");

                // Validar el formato del correo electrónico
                if (!new EmailAddressAttribute().IsValid(request.CorreoElectronico))
                {
                    return BadRequest("El correo electrónico no es válido.");
                }

                existingUser.Nombre = request.Nombre;
                existingUser.CorreoElectronico = request.CorreoElectronico;
                existingUser.FotoPerfil = request.FotoPerfil;

                // Marcar el usuario como modificado en el contexto
                _context.Entry(existingUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(request.UsuarioId))
                    return NotFound("Usuario no encontrado durante la actualización.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error de concurrencia al actualizar el usuario.");
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx)
            {
                return sqlEx.Number switch
                {
                    2627 => Conflict("El correo electrónico ya está en uso."),
                    547 => BadRequest("Violación de integridad referencial."),
                    _ => StatusCode(StatusCodes.Status500InternalServerError, $"Error en la base de datos: {sqlEx.Message}")
                };
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el usuario: {ex.Message}");
            }

            return NoContent();
        }

        /// <summary>
        /// Elimina un usuario existente de manera definitiva.
        /// </summary>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUsuario()
        {
            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext) ?? 0;

                if (userID <= 0)
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");

                var usuarioExistente = await _context.Usuarios.FindAsync(userID);
                if (usuarioExistente == null)
                    return NotFound("Usuario no encontrado.");

                var paramUsuarioId = new SqlParameter("@UsuarioId", userID);
                await _context.Database.ExecuteSqlRawAsync("EXEC EliminarUsuario @UsuarioId", paramUsuarioId);

                return NoContent();
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el usuario en la base de datos: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error SQL al eliminar el usuario: {sqlEx.Message}, Código de error: {sqlEx.Number}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error inesperado al eliminar el usuario: {ex.Message}");
            }
        }

        private bool UsuarioExists(int id)
        {
            try
            {
                return _context.Usuarios.Any(e => e.UsuarioId == id);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
