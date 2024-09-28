using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace finaz_app.Server.Controllers
{
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

        // GET: api/Ingresoes
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<IngresosDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<IngresosDTO>>> GetIngresos()
        {
            try
            {
                var ingresos = await _context.Ingresos
                    .Include(g => g.Usuario)
                    .Include(g => g.Categoria)
                    .ToListAsync();

                var ingresosDTO = _mapper.Map<IEnumerable<IngresosDTO>>(ingresos);

                return Ok(ingresosDTO);
            }
            catch (Exception ex)
            {
                // Manejo de error
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error en la obtención de datos: {ex.Message}");
            }
        }

        // GET: api/Ingresoes/5
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
                var ingreso = await _context.Ingresos.FindAsync(id);

                if (ingreso == null)
                {
                    return NotFound();
                }

                var ingresosDTO = _mapper.Map<IngresosDTO>(ingreso);
                return Ok(ingresosDTO);
            }
            catch (Exception ex)
            {
                // Manejo de error
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el ingreso: {ex.Message}");
            }
        }

        // PUT: api/Ingresoes/5
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutIngreso(int id, Ingreso ingreso)
        {
            if (id != ingreso.IngresosId)
            {
                return BadRequest("El ID del ingreso no coincide.");
            }

            _context.Entry(ingreso).State = EntityState.Modified;

            try
            {
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
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el ingreso: {ex.Message}");
            }

            return NoContent();
        }

        // POST: api/Ingresoes
        [HttpPost]
        [ProducesResponseType(typeof(Ingreso), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Ingreso>> PostIngreso(Ingreso ingreso)
        {
            try
            {
                _context.Ingresos.Add(ingreso);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetIngreso), new { id = ingreso.IngresosId }, ingreso);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear el ingreso: {ex.Message}");
            }
        }

        // DELETE: api/Ingresoes/5
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

                _context.Ingresos.Remove(ingreso);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el ingreso: {ex.Message}");
            }
        }

        private bool IngresoExists(int id)
        {
            try
            {
                return _context.Ingresos.Any(e => e.IngresosId == id);
            }
            catch (Exception)
            {
                // Manejo de error al consultar existencia
                return false;
            }
        }
    }
}
