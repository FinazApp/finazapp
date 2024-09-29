﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para gestionar las operaciones CRUD de los usuarios en el sistema.
    /// </summary>
    /// <remarks>
    /// Este controlador permite realizar operaciones como obtener, crear, modificar y eliminar usuarios.
    /// Algunas rutas están protegidas para que solo usuarios con el rol de "admin" puedan acceder.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador de usuarios.
        /// </summary>
        /// <param name="context">El contexto de la base de datos para FinanzApp.</param>
        /// <param name="mapper">Instancia de IMapper para mapear entidades a DTOs.</param>
        public UsuariosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene todos los usuarios.
        /// </summary>
        /// <returns>Devuelve una lista de usuarios en formato DTO.</returns>
        /// <response code="200">Operación exitosa, devuelve la lista de usuarios.</response>
        /// <response code="500">Error interno del servidor al obtener los usuarios.</response>
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
        /// <response code="200">Operación exitosa, devuelve el usuario.</response>
        /// <response code="404">Usuario no encontrado.</response>
        /// <response code="500">Error interno del servidor al obtener el usuario.</response>
        [HttpGet("{id}")]
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
        /// <param name="id">El ID del usuario a actualizar.</param>
        /// <param name="usuario">Objeto de usuario con los datos actualizados.</param>
        /// <returns>Devuelve un código de éxito o error.</returns>
        /// <response code="204">El usuario se actualizó exitosamente.</response>
        /// <response code="400">El ID del usuario no coincide con el parámetro proporcionado.</response>
        /// <response code="404">Usuario no encontrado.</response>
        /// <response code="500">Error interno del servidor al actualizar el usuario.</response>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return BadRequest("El ID del usuario no coincide.");
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error de concurrencia al actualizar el usuario.");
                }
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
        /// <param name="usuario">El objeto de usuario a crear.</param>
        /// <returns>Devuelve el usuario creado y su ID.</returns>
        /// <response code="201">El usuario se creó exitosamente.</response>
        /// <response code="400">Datos de entrada inválidos.</response>
        /// <response code="500">Error interno del servidor al crear el usuario.</response>
        [HttpPost]
        [ProducesResponseType(typeof(Usuario), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            try
            {
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUsuario), new { id = usuario.UsuarioId }, usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el usuario: {ex.Message}");
            }
        }

        /// <summary>
        /// Elimina un usuario existente.
        /// </summary>
        /// <param name="id">El ID del usuario a eliminar.</param>
        /// <returns>Devuelve un código de éxito o error.</returns>
        /// <response code="204">El usuario se eliminó exitosamente.</response>
        /// <response code="404">Usuario no encontrado.</response>
        /// <response code="500">Error interno del servidor al eliminar el usuario.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                {
                    return NotFound();
                }

                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el usuario: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifica si un usuario existe en la base de datos.
        /// </summary>
        /// <param name="id">El ID del usuario a verificar.</param>
        /// <returns>True si el usuario existe, false en caso contrario.</returns>
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
