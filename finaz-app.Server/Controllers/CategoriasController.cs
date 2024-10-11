using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de categorías en FinanzApp.
    /// </summary>
    /// <remarks>
    /// Este controlador maneja las operaciones CRUD para las categorías, como listar, obtener, 
    /// crear, actualizar y eliminar categorías.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "usuario, admin")]
    public class CategoriasController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor de CategoriasController.
        /// </summary>
        /// <param name="context">Contexto de la base de datos de FinanzApp.</param>
        /// <param name="mapper">Interfaz de AutoMapper para mapear entidades a DTOs.</param>
        public CategoriasController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene todas las categorías.
        /// </summary>
        /// <returns>Una lista de CategoriasDTO.</returns>
        /// <response code="200">Devuelve la lista de categorías.</response>
        /// <response code="401">No autorizado.</response>
        /// <response code="403">Prohibido para el rol actual.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoriasDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<CategoriasDTO>>> GetCategorias()
        {
            try
            {
                var categorias = await _context.Categorias.Include(g => g.Usuario).ToListAsync();
                var categoriasDTO = _mapper.Map<IEnumerable<CategoriasDTO>>(categorias);
                return Ok(categoriasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene una categoría específica por ID.
        /// </summary>
        /// <param name="id">ID de la categoría.</param>
        /// <returns>Una categoría específica.</returns>
        /// <response code="200">Devuelve la categoría solicitada.</response>
        /// <response code="404">Categoría no encontrada.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IEnumerable<CategoriasDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoriasDTO>> GetCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.Include(g => g.Usuario).SingleOrDefaultAsync(a => a.CategoriaId == id);
                var categoriasDTO = _mapper.Map<CategoriasDTO>(categoria);

                if (categoriasDTO == null)
                {
                    return NotFound();
                }

                return Ok(categoriasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza una categoría existente.
        /// </summary>
        /// <param name="id">ID de la categoría a actualizar.</param>
        /// <param name="categoria">Datos de la categoría actualizados.</param>
        /// <returns>Resultado de la operación.</returns>
        /// <response code="204">Categoría actualizada correctamente.</response>
        /// <response code="400">El ID proporcionado no coincide.</response>
        /// <response code="404">Categoría no encontrada.</response>
        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.CategoriaId)
            {
                return BadRequest("El ID del usuario no coincide.");
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
                {
                    return NotFound($"No se encontró el usuario con ID = {id}");
                }
                else
                {
                    return StatusCode(500, "Ocurrió un error al actualizar el usuario.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }

            return NoContent();
        }

        /// <summary>
        /// Crea una nueva categoría.
        /// </summary>
        /// <param name="categoria">Los datos de la nueva categoría.</param>
        /// <returns>La categoría creada.</returns>
        /// <response code="201">Categoría creada correctamente.</response>
        /// <response code="400">Solicitud incorrecta.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Categoria>> PostCategoria([FromBody] Categoria categoria)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Categorias.Add(categoria);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategoria", new { id = categoria.CategoriaId }, categoria);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, "Error de base de datos al guardar la categoría.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error inesperado en el servidor.");
            }
        }

        /// <summary>
        /// Elimina una categoría por ID.
        /// </summary>
        /// <param name="id">ID de la categoría a eliminar.</param>
        /// <returns>Resultado de la operación.</returns>
        /// <response code="204">Categoría eliminada correctamente.</response>
        /// <response code="404">Categoría no encontrada.</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null)
                {
                    return NotFound();
                }

                _context.Categorias.Remove(categoria);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifica si una categoría existe.
        /// </summary>
        /// <param name="id">ID de la categoría a verificar.</param>
        /// <returns>True si la categoría existe, de lo contrario false.</returns>
        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.CategoriaId == id);
        }
    }
}