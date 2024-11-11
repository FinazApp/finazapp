﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using AutoMapper;
using finaz_app.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using finaz_app.Server.Security.JWT;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador API para la gestión de categorías en FinanzApp.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "usuario, admin")]
    public class CategoriasController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        public CategoriasController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoriasDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<CategoriasDTO>>> GetCategorias()
        {
            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var categorias = await _context.Categorias
                    .Where(c => c.CreadoPor == userID || c.CreadoPor == null)
                    .Where(c => !c.isDeleted)
                    .ToListAsync();

                var categoriasDTO = _mapper.Map<IEnumerable<CategoriasDTO>>(categorias);
                return Ok(categoriasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CategoriasDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoriasDTO>> GetCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias
                    .SingleOrDefaultAsync(a => a.CategoriaId == id && !a.isDeleted);

                if (categoria == null)
                {
                    return NotFound($"No se encontró la categoría con ID = {id}");
                }

                var categoriasDTO = _mapper.Map<CategoriasDTO>(categoria);
                return Ok(categoriasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PutCategoria(int id, [FromBody] Categoria categoria)
        {
            if (id != categoria.CategoriaId)
            {
                return BadRequest("El ID de la categoría no coincide.");

            }

            var existingCategoria = await _context.Categorias.FindAsync(id);
            if (existingCategoria == null || existingCategoria.isDeleted)
            {
                return NotFound($"No se encontró la categoría con ID = {id}");
            }

            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            existingCategoria.isSystem = User.IsInRole("admin");

            existingCategoria.Nombre = categoria.Nombre;
            existingCategoria.Descripcion = categoria.Descripcion;
            existingCategoria.ModificadoPor = userID.Value;
            existingCategoria.FechaModificado = DateTime.UtcNow;

            _context.Entry(existingCategoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
                {
                    return NotFound($"No se encontró la categoría con ID = {id}");
                }
                else
                {
                    return StatusCode(500, "Ocurrió un error al actualizar la categoría.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }

            return NoContent();
        }

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
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                categoria.isSystem = User.IsInRole("admin");

                categoria.ModificadoPor = userID.Value;
                categoria.CreadoPor = userID.Value;
                categoria.FechaCreacion = DateTime.UtcNow;
                categoria.FechaModificado = DateTime.UtcNow;

                _context.Categorias.Add(categoria);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategoria), new { id = categoria.CategoriaId }, categoria);
            }
            catch (DbUpdateException dbEx) when (dbEx.InnerException != null)
            {
                return StatusCode(500, $"Error al guardar la categoría: {dbEx.InnerException.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error inesperado: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null || categoria.isDeleted)
                {
                    return NotFound($"No se encontró la categoría con ID = {id}");
                }

                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                categoria.ModificadoPor = userID.Value;
                categoria.FechaModificado = DateTime.UtcNow;
                categoria.isDeleted = true;
                _context.Entry(categoria).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.CategoriaId == id && !e.isDeleted);
        }

        [HttpPost("restore")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RestoreUserCategories()
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            try
            {
                // Restaurar categorías, gastos e ingresos del usuario que estén marcados como eliminados
                var categorias = await _context.Categorias
                    .Where(c => c.CreadoPor == userID && c.isDeleted)
                    .ToListAsync();
                var gastos = await _context.Gastos
                    .Where(g => g.CreadoPor == userID && g.isDeleted)
                    .ToListAsync();
                var ingresos = await _context.Ingresos
                    .Where(i => i.CreadoPor == userID && i.isDeleted)
                    .ToListAsync();

                // Cambiar el estado de 'isDeleted' a falso
                categorias.ForEach(c => c.isDeleted = false);
                gastos.ForEach(g => g.isDeleted = false);
                ingresos.ForEach(i => i.isDeleted = false);

                await _context.SaveChangesAsync();
                return Ok("Categorías, ingresos y gastos restaurados correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        [HttpGet("user/me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAuthenticatedUser()
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            var user = await _context.Usuarios
                .AsNoTracking() // Para optimizar si no se va a modificar el objeto
                .FirstOrDefaultAsync(u => u.UsuarioId == userID);

            if (user == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            return Ok(new {
                user.UsuarioId,
                user.Nombre,
                user.CorreoElectronico,
                user.Rol
            });
        }
    }
}
