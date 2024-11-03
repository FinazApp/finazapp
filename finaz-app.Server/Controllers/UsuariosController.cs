using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using System.ComponentModel.DataAnnotations;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para gestionar las operaciones CRUD de los usuarios en el sistema.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        public UsuariosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene todos los usuarios.
        /// </summary>
        /// <returns>Devuelve una lista de usuarios en formato DTO.</returns>
        [HttpGet]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(IEnumerable<UsuariosDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<UsuariosDTO>>> GetUsuarios()
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
        /// Obtiene un usuario específico por ID.
        /// </summary>
        /// <param name="id">El ID del usuario a obtener.</param>
        /// <returns>Devuelve el usuario en formato DTO.</returns>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(UsuariosDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UsuariosDTO>> GetUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);

                if (usuario == null)
                {
                    return NotFound();
                }

                var usuariosDto = _mapper.Map<UsuariosDTO>(usuario);
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
        [HttpPatch("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> PutUsuario(int id, UsuariosDTO request)
        {
            if (id != request.UsuarioId)
                return BadRequest("El ID del usuario no coincide con el parámetro proporcionado.");

            var existingUser = await _context.Usuarios.FindAsync(id);
            if (existingUser == null)
                return NotFound("Usuario no encontrado.");

            var nombreExistente = await _context.Usuarios.FirstOrDefaultAsync(u => u.Nombre == request.Nombre && u.UsuarioId != id);
            if (nombreExistente != null)
                return Conflict("El nombre ya está en uso.");

            existingUser.Nombre = request.Nombre;
            existingUser.CorreoElectronico = request.CorreoElectronico;

            if (!string.IsNullOrWhiteSpace(request.PasswordHash))
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);

            existingUser.Rol = request.Rol;

            _context.Entry(existingUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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
        /// Crea un nuevo usuario.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(UsuariosDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UsuariosDTO>> PostUsuario(UsuariosDTO usuarioDto)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(usuarioDto);
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                var createdUsuarioDto = _mapper.Map<UsuariosDTO>(usuario);
                return CreatedAtAction(nameof(GetUsuario), new { id = createdUsuarioDto.UsuarioId }, createdUsuarioDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el usuario: {ex.Message}");
            }
        }

        /// <summary>
        /// Elimina un usuario existente de manera definitiva.
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            try
            {
                var paramUsuarioId = new SqlParameter("@UsuarioId", id);
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
