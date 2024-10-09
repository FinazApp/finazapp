using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de ingresos en FinanzApp.
    /// </summary>
    /// <remarks>
    /// Este controlador maneja las operaciones CRUD para los ingresos, como listar, obtener, 
    /// crear, actualizar y eliminar ingresos.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "usuario, admin")]
    public class IngresosController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador IngresosController.
        /// </summary>
        /// <param name="context">Contexto de la base de datos de FinanzApp.</param>
        /// <param name="mapper">Instancia de AutoMapper para mapear entidades a DTOs.</param>
        public IngresosController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene todos los ingresos.
        /// </summary>
        /// <returns>Una lista de objetos IngresosDTO.</returns>
        /// <response code="200">Devuelve la lista de ingresos.</response>
        /// <response code="401">No autorizado.</response>
        /// <response code="403">Prohibido.</response>
        /// <response code="500">Error interno del servidor.</response>
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
                    .Include(i => i.Usuario)
                    .Include(i => i.Categoria)
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
        /// <param name="id">ID del ingreso a obtener.</param>
        /// <returns>El objeto IngresosDTO correspondiente al ID proporcionado.</returns>
        /// <response code="200">Devuelve el ingreso solicitado.</response>
        /// <response code="404">No se encontró el ingreso.</response>
        /// <response code="401">No autorizado.</response>
        /// <response code="403">Prohibido.</response>
        /// <response code="500">Error interno del servidor.</response>
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
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el ingreso: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza un ingreso existente.
        /// </summary>
        /// <param name="id">ID del ingreso a actualizar.</param>
        /// <param name="ingreso">Objeto Ingreso con los datos actualizados.</param>
        /// <returns>Resultado de la operación.</returns>
        /// <response code="204">Ingreso actualizado correctamente.</response>
        /// <response code="400">El ID proporcionado no coincide con el ID del ingreso.</response>
        /// <response code="404">No se encontró el ingreso.</response>
        /// <response code="500">Error interno del servidor.</response>
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

        /// <summary>
        /// Crea un nuevo ingreso.
        /// </summary>
        /// <param name="ingreso">Objeto Ingreso a crear.</param>
        /// <returns>El objeto Ingreso creado.</returns>
        /// <response code="201">Ingreso creado correctamente.</response>
        /// <response code="400">Solicitud incorrecta.</response>
        /// <response code="500">Error interno del servidor.</response>
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

        /// <summary>
        /// Elimina un ingreso existente por su ID.
        /// </summary>
        /// <param name="id">ID del ingreso a eliminar.</param>
        /// <returns>Resultado de la operación.</returns>
        /// <response code="204">Ingreso eliminado correctamente.</response>
        /// <response code="404">No se encontró el ingreso.</response>
        /// <response code="500">Error interno del servidor.</response>
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

        /// <summary>
        /// Verifica si un ingreso existe en la base de datos.
        /// </summary>
        /// <param name="id">ID del ingreso a verificar.</param>
        /// <returns>True si el ingreso existe, de lo contrario false.</returns>
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

        /// <summary>
        /// Genera un reporte de ingresos en un rango de fechas.
        /// </summary>
        /// <param name="fechaInicio">Fecha de inicio del reporte.</param>
        /// <param name="fechaFin">Fecha de fin del reporte.</param>
        /// <returns>Un resumen con los ingresos en el periodo seleccionado.</returns>
        [HttpGet("reportes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GenerarReporte(DateTime fechaInicio, DateTime fechaFin)
        {
            if (fechaInicio > fechaFin)
            {
                return BadRequest("La fecha de inicio no puede ser mayor que la fecha de fin.");
            }

            try
            {
                // Obtener los ingresos en el rango de fechas
                var ingresos = await _context.Ingresos
                    .Where(i => i.FechaCreacion >= fechaInicio && i.FechaCreacion <= fechaFin)
                    .ToListAsync();

                // Calcular el total de ingresos
                var totalIngresos = ingresos.Sum(i => i.Monto);

                // Crear un objeto resumen
                var reporte = new 
                {
                    TotalIngresos = totalIngresos,
                    DetallesIngresos = ingresos
                };

                return Ok(reporte);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al generar el reporte: {ex.Message}");
            }
        }
    }
}
