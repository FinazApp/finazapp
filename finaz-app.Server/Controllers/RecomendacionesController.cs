using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using finaz_app.Server.Models;
using finaz_app.Server.Security.JWT;

namespace finaz_app.Server.Controllers
{
    /// <summary>
    /// Controlador para generar recomendaciones personalizadas basadas en los gastos, ingresos y categorías del usuario.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecomendacionesController : ControllerBase
    {
        private readonly FinanzAppContext _appContext;

        public RecomendacionesController(FinanzAppContext appContext)
        {
            _appContext = appContext;
        }

        /// <summary>
        /// Genera recomendaciones personalizadas para un usuario basado en sus ingresos, gastos y categorías.
        /// </summary>
        /// <returns>Devuelve un conjunto de recomendaciones para el usuario.</returns>
        [HttpGet("generar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GenerarRecomendaciones()
        {
            try
            {
                var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);

                if (userID == null)
                {
                    return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
                }

                var usuario = await _appContext.Usuarios
                    .FirstOrDefaultAsync(u => u.UsuarioId == userID);

                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                var totalIngresos = (await _appContext.Ingresos
                    .Where(i => i.CreadoPor == usuario.UsuarioId && !i.isDeleted)
                    .ToListAsync()).Sum(i => i.Monto);

                var totalAhorros = (await _appContext.MetasAhorro
                    .Where(i => i.CreadoPor == usuario.UsuarioId && !i.isDeleted)
                    .ToListAsync()).Sum(i => i.MontoAhorrado);

                var gastos = await _appContext.Gastos
                    .Where(g => g.CreadoPor == usuario.UsuarioId && !g.isDeleted)
                    .ToListAsync();

                decimal totalGastos = gastos.Sum(g => g.Monto);

                var categoriasGastos = await _appContext.Categorias
                    .Where(c => c.CreadoPor == usuario.UsuarioId && !c.isDeleted)
                    .ToListAsync();

                var recomendaciones = new
                {
                    mensaje = "Aquí están tus recomendaciones financieras basadas en tus ingresos y gastos.",
                    totalGastos,
                    totalAhorros,
                    totalIngresos,
                    recomendacionIngreso = totalIngresos < 1000 ? "Considera aumentar tus ingresos. Busca formas de diversificar tus fuentes de ingresos." : "Tus ingresos son estables. Sigue manteniéndolos y busca formas de incrementarlos con el tiempo.",
                    recomendacionGasto = totalGastos > totalIngresos ? "Estás gastando más de lo que ingresas. Considera ajustar tus hábitos de gasto." : "Tus gastos están equilibrados, pero sigue monitoreando tus gastos para mantener este balance.",
                    recomendacionAhorro = totalGastos < totalIngresos ? "¡Excelente! Podrías empezar a ahorrar o invertir el excedente para mejorar tu futuro financiero." : "Intenta reducir tus gastos para ahorrar algo de dinero cada mes. Es fundamental crear un fondo de emergencia.",
                    recomendacionGastosPorCategoria = categoriasGastos.Select(c =>
                    {
                        decimal totalCategoria = gastos.Where(g => g.CategoriaId == c.CategoriaId).Sum(g => g.Monto);
                        return new
                        {
                            categoria = c.Nombre,
                            porcentajeGasto = totalCategoria / totalGastos * 100,
                            recomendacion = totalCategoria / totalGastos > 0.5m ? $"Estás gastando más del 50% en {c.Nombre}. Considera revisar tus hábitos en esta categoría." : $"Tu gasto en {c.Nombre} es bajo, sigue así."
                        };
                    }),
                    recomendacionDeuda = totalGastos > 0.8m * totalIngresos ? "Tu nivel de deuda puede estar afectando tus finanzas. Considera pagar las deudas más costosas primero." : "Tu nivel de deuda parece controlado, sigue monitoreando para evitar sobreendeudamiento.",
                    recomendacionIngresoMensual = totalIngresos < 2000 ? "Tus ingresos son bajos en relación a tus gastos. Busca formas de aumentar tus ingresos mensuales, como trabajos adicionales o formación en áreas de alta demanda." : "Tus ingresos son adecuados. Si es posible, busca estrategias para incrementar aún más tus ingresos mediante inversiones o proyectos a largo plazo."
                };

                return Ok(recomendaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al generar las recomendaciones: {ex.Message}");
            }
        }
    }
}
