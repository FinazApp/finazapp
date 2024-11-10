using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using finaz_app.Server.Security.JWT;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de ingresos en FinanzApp.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "usuario, admin")]
    public class IngresosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        public IngresosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene todos los ingresos.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<IngresosDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<IngresosDTO>>> GetIngresos()
        {
            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);

                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var ingresos = await _context.Ingresos
                    .Include(i => i.Categoria)
                    .Where(i => (i.CreadoPor == userID || i.CreadoPor == null))
                    .ToListAsync();

                var ingresosDTO = _mapper.Map<IEnumerable<IngresosDTO>>(ingresos);
                return Ok(ingresosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error en la obtención de datos: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene un ingreso específico por su ID.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IngresosDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IngresosDTO>> GetIngreso(int id)
        {
            try
            {
                var ingreso = await _context.Ingresos
                    .Include(i => i.Categoria)
                    .SingleOrDefaultAsync(i => i.IngresoId == id);

                if (ingreso == null)
                {
                    return NotFound();
                }

                var ingresosDTO = _mapper.Map<IngresosDTO>(ingreso);
                return Ok(ingresosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el ingreso: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza un ingreso existente.
        /// </summary>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutIngreso(int id, Ingreso ingreso)
        {
            if (id != ingreso.IngresoId)
            {
                return BadRequest("El ID del ingreso no coincide.");
            }

            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var existingIngreso = await _context.Ingresos.FindAsync(id);
                if (existingIngreso == null)
                {
                    return NotFound();
                }

                ingreso.CreadoPor = existingIngreso.CreadoPor;
                ingreso.FechaCreacion = existingIngreso.FechaCreacion;

                var userExists = await _context.Usuarios.AnyAsync(u => u.UsuarioId == userID.Value);
                if (!userExists)
                {
                    return Unauthorized("El usuario no existe en el sistema.");
                }

                ingreso.ModificadoPor = userID.Value;
                ingreso.FechaModificado = DateTime.UtcNow;

                _context.Entry(existingIngreso).CurrentValues.SetValues(ingreso);

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngresoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error de concurrencia al actualizar el ingreso.");
                }
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el ingreso: {ex.Message} - Detalles: {innerExceptionMessage}");
            }

            return NoContent();
        }

        /// <summary>
        /// Crea un nuevo ingreso.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(Ingreso), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Ingreso>> PostIngreso(Ingreso ingreso)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                ingreso.CreadoPor = userID.Value;
                ingreso.ModificadoPor = userID.Value;
                ingreso.FechaCreacion = DateTime.UtcNow;
                ingreso.FechaModificado = DateTime.UtcNow;

                _context.Ingresos.Add(ingreso);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetIngreso), new { id = ingreso.IngresoId }, ingreso);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el ingreso: {dbEx.Message} - Detalles: {dbEx.InnerException?.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el ingreso: {ex.Message} - Detalles: {ex.InnerException?.Message}");
            }
        }

        /// <summary>
        /// Elimina un ingreso existente por su ID.
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteIngreso(int id)
        {
            try
            {
                var ingreso = await _context.Ingresos.FindAsync(id);
                if (ingreso == null)
                {
                    return NotFound();
                }

                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                ingreso.ModificadoPor = userID.Value;
                ingreso.FechaModificado = DateTime.UtcNow;
                ingreso.isDeleted = true;
                _context.Entry(ingreso).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el ingreso: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Verifica si un ingreso existe en la base de datos.
        /// </summary>
        private bool IngresoExists(int id)
        {
            try
            {
                return _context.Ingresos.Any(e => e.IngresoId == id);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
