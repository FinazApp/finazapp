using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;

namespace finaz_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GastosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        public GastosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Gastoes
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
                // Manejo de error
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error en la obtención de datos: {ex.Message}");
            }
        }

        // GET: api/Gastoes/5
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

        // PUT: api/Gastoes/5
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

        // POST: api/Gastoes
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

        // DELETE: api/Gastoes/5
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
