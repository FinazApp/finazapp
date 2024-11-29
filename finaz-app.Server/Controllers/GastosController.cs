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
using System.Numerics;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de gastos en FinanzApp.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GastosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;
        private readonly Restore _restore;

        public GastosController(FinanzAppContext context, IMapper mapper, Restore restor)
        {
            _context = context;
            _mapper = mapper;
            _restore = restor ?? throw new ArgumentNullException(nameof(restor));

        }

        /// <summary>
        /// Obtiene todos los gastos.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GastosDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<GastosDTO>>> GetGastos()
        {
            try
            {
                var userIDT = JwtHelper.ObtenerIdDeJwt(HttpContext);

                if (userIDT == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var gastos = await _context.Gastos
                    .Include(g => g.Categoria)
                    .Where(g => g.CreadoPor == userIDT)
                    .ToListAsync();

                Console.WriteLine(gastos);

                var gastosDTO = _mapper.Map<IEnumerable<GastosDTO>>(gastos);

                return Ok(gastosDTO);
            }
            catch (FormatException)
            {
                return BadRequest("El ID de usuario no tiene el formato correcto.");
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener datos del gasto: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Obtiene un gasto específico por su ID.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GastosDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GastosDTO>> GetGasto(int id)
        {
            try
            {
                var gasto = await _context.Gastos
                    .Include(g => g.Categoria)
                    .SingleOrDefaultAsync(a => a.GastoId == id);

                if (gasto == null)
                {
                    return NotFound();
                }

                var gastosDTO = _mapper.Map<GastosDTO>(gasto);
                return Ok(gastosDTO);
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el gasto: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Actualiza un gasto existente.
        /// </summary>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutGasto(int id, Gasto gasto)
        {
            if (id != gasto.GastoId)
            {
                return BadRequest("El ID del gasto no coincide.");
            }

            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var userExists = await _context.Usuarios.AnyAsync(u => u.UsuarioId == userID.Value);
                if (!userExists)
                {
                    return Unauthorized("El usuario no existe en el sistema.");
                }

                var existingGasto = await _context.Gastos.FindAsync(id);
                if (existingGasto == null || existingGasto.isDeleted)
                {
                    return NotFound();
                }

                gasto.CreadoPor = existingGasto.CreadoPor;
                gasto.FechaCreacion = existingGasto.FechaCreacion;

                gasto.ModificadoPor = userID.Value;
                gasto.FechaModificado = DateTime.UtcNow;

                _context.Entry(existingGasto).CurrentValues.SetValues(gasto);

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GastoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error de concurrencia al actualizar el gasto.");
                }
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el gasto: {ex.Message} - Detalles: {innerExceptionMessage}");
            }

            return NoContent();
        }

        /// <summary>
        /// Crea un nuevo gasto.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(Gasto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Gasto>> PostGasto(Gasto gasto)
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

                gasto.CreadoPor = userID.Value;
                gasto.ModificadoPor = userID.Value;
                gasto.FechaCreacion = DateTime.UtcNow;
                gasto.FechaModificado = DateTime.UtcNow;
                _context.Gastos.Add(gasto);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGasto), new { id = gasto.GastoId }, gasto);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el gasto: {dbEx.Message} - Detalles: {dbEx.InnerException?.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el gasto: {ex.Message} - Detalles: {ex.InnerException?.Message}");
            }
        }

        /// <summary>
        /// Elimina un gasto existente por su ID.
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteGasto(int id)
        {
            try
            {
                var gasto = await _context.Gastos.FindAsync(id);
                if (gasto == null)
                {
                    return NotFound();
                }

                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                gasto.ModificadoPor = userID.Value;
                gasto.FechaModificado = DateTime.UtcNow;
                gasto.isDeleted = true;
                _context.Entry(gasto).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el gasto: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        [HttpPost("Restore/{id}")]
        public async Task<IActionResult> RestoreCategoryById(int id)
        {
            var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userId == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            var (statusCode, message) = await _restore.RestoreEntity<Gasto>(
                id,
                userId.Value,
                "Gastos",
                "GastoId");

            return StatusCode(statusCode, message);
        }

        /// <summary>
        /// Verifica si un gasto existe en la base de datos.
        /// </summary>
        private bool GastoExists(int id)
        {
            try
            {
                return _context.Gastos.Any(e => e.GastoId == id && !e.isDeleted);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
