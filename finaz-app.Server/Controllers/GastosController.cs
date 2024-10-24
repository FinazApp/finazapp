using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de gastos en FinanzApp.
    /// </summary>
    /// <remarks>
    /// Este controlador maneja las operaciones CRUD para los gastos, como listar, obtener, 
    /// crear, actualizar y eliminar gastos.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "usuario, admin")]
    public class GastosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador GastosController.
        /// </summary>
        /// <param name="context">Contexto de la base de datos de FinanzApp.</param>
        /// <param name="mapper">Instancia de AutoMapper para mapear entidades a DTOs.</param>
        public GastosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene todos los gastos.
        /// </summary>
        /// <returns>Una lista de objetos GastosDTO.</returns>
        /// <response code="200">Devuelve la lista de gastos.</response>
        /// <response code="401">No autorizado.</response>
        /// <response code="403">Prohibido.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GastosDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<GastosDTO>>> GetGastos()
        {
            try
            {
                var gastos = await _context.Gastos
                    .Include(g => g.Usuario)
                    .Include(g => g.Categoria)
                    .ToListAsync();

                var gastosDTO = _mapper.Map<IEnumerable<GastosDTO>>(gastos);

                return Ok(gastosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error en la obtención de datos: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene un gasto específico por su ID.
        /// </summary>
        /// <param name="id">ID del gasto a obtener.</param>
        /// <returns>El objeto GastosDTO correspondiente al ID proporcionado.</returns>
        /// <response code="200">Devuelve el gasto solicitado.</response>
        /// <response code="404">No se encontró el gasto.</response>
        /// <response code="401">No autorizado.</response>
        /// <response code="403">Prohibido.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GastosDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<GastosDTO>> GetGasto(int id)
        {
            try
            {
                var gasto = await _context.Gastos.FindAsync(id);

                if (gasto == null)
                {
                    return NotFound();
                }

                var gastosDTO = _mapper.Map<GastosDTO>(gasto);
                return Ok(gastosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el gasto: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza un gasto existente.
        /// </summary>
        /// <param name="id">ID del gasto a actualizar.</param>
        /// <param name="gasto">Objeto Gasto con los datos actualizados.</param>
        /// <returns>Resultado de la operación.</returns>
        /// <response code="204">Gasto actualizado correctamente.</response>
        /// <response code="400">El ID proporcionado no coincide con el ID del gasto.</response>
        /// <response code="404">No se encontró el gasto.</response>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutGasto(int id, Gasto gasto)
        {
            if (id != gasto.GastosId)
            {
                return BadRequest("El ID del gasto no coincide.");
            }

            _context.Entry(gasto).State = EntityState.Modified;

            try
            {
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
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el gasto: {ex.Message}");
            }

            return NoContent();
        }

        /// <summary>
        /// Crea un nuevo gasto.
        /// </summary>
        /// <param name="gasto">Objeto Gasto a crear.</param>
        /// <returns>El objeto Gasto creado.</returns>
        /// <response code="201">Gasto creado correctamente.</response>
        /// <response code="400">Solicitud incorrecta.</response>
        [HttpPost]
        [ProducesResponseType(typeof(Gasto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Gasto>> PostGasto(Gasto gasto)
        {
            try
            {
                _context.Gastos.Add(gasto);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGasto), new { id = gasto.GastosId }, gasto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el gasto: {ex.Message}");
            }
        }

        /// <summary>
        /// Elimina un gasto existente por su ID.
        /// </summary>
        /// <param name="id">ID del gasto a eliminar.</param>
        /// <returns>Resultado de la operación.</returns>
        /// <response code="204">Gasto eliminado correctamente.</response>
        /// <response code="404">No se encontró el gasto.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteGasto(int id)
        {
            try
            {
                var gasto = await _context.Gastos.FindAsync(id);
                if (gasto == null)
                {
                    return NotFound();
                }

                _context.Gastos.Remove(gasto);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el gasto: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifica si un gasto existe en la base de datos.
        /// </summary>
        /// <param name="id">ID del gasto a verificar.</param>
        /// <returns>True si el gasto existe, de lo contrario false.</returns>
        private bool GastoExists(int id)
        {
            try
            {
                return _context.Gastos.Any(e => e.GastosId == id);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}