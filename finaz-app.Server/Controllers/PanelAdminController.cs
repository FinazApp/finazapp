using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para acciones administrativas, como la asignación de roles a los usuarios.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class PanelAdminController : ControllerBase
    {
        private readonly FinanzAppContext _appContext;

        public PanelAdminController(FinanzAppContext appContext)
        {
            _appContext = appContext;
        }

        /// <summary>
        /// Asigna un rol a un usuario específico.
        /// </summary>
        /// <param name="userId">El ID del usuario al que se le asignará el rol.</param>
        /// <param name="rol">El rol que se asignará, por ejemplo, "admin" o "usuario".</param>
        /// <returns>Devuelve un mensaje indicando el éxito o error de la operación.</returns>
        [HttpPut("asignar-rol")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AsignarRol(int userId, string rol)
        {
            rol = rol?.ToLower();
            if (!new[] { "User", "admin" }.Contains(rol))
            {
                return BadRequest("Rol no identificado. Los roles válidos son 'usuario' o 'admin'.");
            }

            try
            {
                var usuario = await _appContext.Usuarios.FirstOrDefaultAsync(u => u.UsuarioId == userId);
                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                usuario.Rol = rol;
                await _appContext.SaveChangesAsync();

                return Ok(new { message = "Rol asignado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al asignar el rol: {ex.Message}");
            }
        }
    }
}
