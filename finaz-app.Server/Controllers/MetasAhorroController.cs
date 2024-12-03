using AutoMapper;
using finaz_app.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models.DTOs;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Authorization;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de metas de ahorro en FinanzApp.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MetasAhorroController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;
        private readonly Restore _restore;

        public MetasAhorroController(FinanzAppContext context, IMapper mapper, Restore restore)
        {
            _context = context;
            _mapper = mapper;
            _restore = restore ?? throw new ArgumentNullException(nameof(restore));
        }

        public class MetaAhorroFondo
        {
            public int MetaId { get; set; }
            public int NuevoFondo { get; set; }
        }

        /// <summary>
        /// Obtiene todas las metas de ahorro.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<MetasAhorroDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<MetasAhorroDTO>>> GetMetasAhorro()
        {
            try
            {
                var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);

                if (userId == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var metasAhorro = await _context.MetasAhorro
                    .Where(m => m.CreadoPor == userId)
                    .ToListAsync();

                var metasAhorroDTO = _mapper.Map<IEnumerable<MetasAhorroDTO>>(metasAhorro);

                return Ok(metasAhorroDTO);
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener las metas de ahorro: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Obtiene una meta de ahorro específica por su ID.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(MetasAhorroDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MetasAhorroDTO>> GetMetaAhorro(int id)
        {
            try
            {
                var metaAhorro = await _context.MetasAhorro
                    .SingleOrDefaultAsync(m => m.MetaId == id && !m.isDeleted);

                if (metaAhorro == null)
                {
                    return NotFound();
                }

                var metaAhorroDTO = _mapper.Map<MetasAhorroDTO>(metaAhorro);
                return Ok(metaAhorroDTO);
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener la meta de ahorro: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Actualiza una meta de ahorro existente.
        /// </summary>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutMetaAhorro(int id, MetaAhorro metaAhorro)
        {
            if (id != metaAhorro.MetaId)
            {
                return BadRequest("El ID de la meta de ahorro no coincide.");
            }

            try
            {
                var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userId == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var userExists = await _context.Usuarios.AnyAsync(u => u.UsuarioId == userId.Value);
                if (!userExists)
                {
                    return Unauthorized("El usuario no existe en el sistema.");
                }

                var existingMetaAhorro = await _context.MetasAhorro.FindAsync(id);
                if (existingMetaAhorro == null || existingMetaAhorro.isDeleted)
                {
                    return NotFound();
                }

                metaAhorro.CreadoPor = existingMetaAhorro.CreadoPor;
                metaAhorro.FechaCreacion = existingMetaAhorro.FechaCreacion;

                metaAhorro.ModificadoPor = userId.Value;
                metaAhorro.FechaModificado = DateTime.UtcNow;

                _context.Entry(existingMetaAhorro).CurrentValues.SetValues(metaAhorro);

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MetaAhorroExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error de concurrencia al actualizar la meta de ahorro.");
                }
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar la meta de ahorro: {ex.Message} - Detalles: {innerExceptionMessage}");
            }

            return NoContent();
        }

        /// <summary>
        /// Crea una nueva meta de ahorro.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(MetaAhorro), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MetaAhorro>> PostMetaAhorro(MetaAhorro metaAhorro)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userId == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                metaAhorro.CreadoPor = userId.Value;
                metaAhorro.ModificadoPor = userId.Value;
                metaAhorro.FechaCreacion = DateTime.UtcNow;
                metaAhorro.FechaModificado = DateTime.UtcNow;

                _context.MetasAhorro.Add(metaAhorro);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMetaAhorro), new { id = metaAhorro.MetaId }, metaAhorro);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear la meta de ahorro: {dbEx.Message} - Detalles: {dbEx.InnerException?.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al crear la meta de ahorro: {ex.Message} - Detalles: {ex.InnerException?.Message}");
            }
        }

        /// <summary>
        /// Elimina una meta de ahorro existente por su ID.
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteMetaAhorro(int id)
        {
            try
            {
                var metaAhorro = await _context.MetasAhorro.FindAsync(id);
                if (metaAhorro == null)
                {
                    return NotFound();
                }

                var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userId == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                metaAhorro.ModificadoPor = userId.Value;
                metaAhorro.FechaModificado = DateTime.UtcNow;
                metaAhorro.isDeleted = true;
                _context.Entry(metaAhorro).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar la meta de ahorro: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        [HttpPost("Restore/{id}")]
        public async Task<IActionResult> RestoreMetaAhorroById(int id)
        {
            var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userId == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            var (statusCode, message) = await _restore.RestoreEntity<MetaAhorro>(
                id,
                userId.Value,
                "MetasAhorro",
                "MetaId");

            return StatusCode(statusCode, message);
        }

        /// <summary>
        /// Agrega fondos una meta de ahorro existente por su ID.
        /// </summary>
        [HttpPost("AddFondo")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddFondoMetaAhorro([FromBody] MetaAhorroFondo request)
        {
            try
            {
                var metaAhorro = await _context.MetasAhorro.FindAsync(request.MetaId);
                if (metaAhorro == null)
                {
                    return NotFound();
                }

                var userId = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userId == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                metaAhorro.ModificadoPor = userId.Value;
                metaAhorro.FechaModificado = DateTime.UtcNow;
                metaAhorro.MontoAhorrado += request.NuevoFondo;
                _context.Entry(metaAhorro).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                var innerExceptionMessage = ex.InnerException?.Message ?? "Sin detalles adicionales.";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar la meta de ahorro: {ex.Message} - Detalles: {innerExceptionMessage}");
            }
        }

        /// <summary>
        /// Consulta si el usuario tiene balance.
        /// </summary>
        [HttpGet("ConsultaBalance")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ConsultaBalance()
        {
            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                // Datos en el rango
                var ingresos = (await _context.Ingresos
                    .Where(i => i.CreadoPor == userID && !i.isDeleted)
                    .ToListAsync()).Sum(i => i.Monto);

                var gastos = (await _context.Gastos
                    .Where(g => g.CreadoPor == userID && !g.isDeleted)
                    .ToListAsync()).Sum(i => i.Monto);

                var metasAhorros = (await _context.MetasAhorro
                    .Where(g => g.CreadoPor == userID && !g.isDeleted)
                    .ToListAsync()).Sum(i => i.MontoAhorrado);

                var balanceRango = (ingresos - gastos) - metasAhorros;

                return Ok(balanceRango);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el usuario: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifica si una meta de ahorro existe en la base de datos.
        /// </summary>
        private bool MetaAhorroExists(int id)
        {
            try
            {
                return _context.MetasAhorro.Any(e => e.MetaId == id && !e.isDeleted);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
