using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using System.Globalization;

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


        /// <summary>
        /// Obtiene el balance, los ingresos y los gastos dentro de un rango de fechas específico,
        /// y calcula el porcentaje de cambio comparado con el período anterior.
        /// También devuelve las últimas transacciones de ingresos y gastos.
        /// </summary>
        /// <param name="fechaInicio">La fecha de inicio del rango.</param>
        /// <param name="fechaFin">La fecha de fin del rango.</param>
        /// <returns>Un objeto con el balance, los ingresos, los gastos, y las últimas transacciones.</returns>
        [HttpGet("Balance")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> ObtenerBalance(string inicioFecha, string finFecha)
        {
            DateTime fechaInicio;
            DateTime fechaFin;

            // Intentar convertir las fechas a DateTime con el formato "dd/MM/yyyy"
            bool inicioValido = DateTime.TryParseExact(inicioFecha, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaInicio);
            bool finValido = DateTime.TryParseExact(finFecha, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaFin);

            if (!inicioValido || !finValido)
            {
                return BadRequest("Las fechas deben estar en el formato DD/MM/YYYY.");
            }

            if (fechaInicio > fechaFin)
            {
                return BadRequest("La fecha de inicio no puede ser mayor que la fecha de fin.");
            }
            
            try
            {
                // Obtener los ingresos y gastos dentro del rango de fechas
                var ingresos = await _appContext.Ingresos
                    .Where(i => i.FechaModificado >= fechaInicio && i.FechaModificado <= fechaFin && !i.isDeleted)
                    .ToListAsync();

                var gastos = await _appContext.Gastos
                    .Where(g => g.FechaModificado >= fechaInicio && g.FechaModificado <= fechaFin && !g.isDeleted)
                    .ToListAsync();

                // Calcular el balance
                var totalIngresos = ingresos.Sum(i => i.Monto);
                var totalGastos = gastos.Sum(g => g.Monto);
                var balance = totalIngresos - totalGastos;

                // Obtener el balance del periodo anterior (por ejemplo, el mes pasado)
                var fechaInicioAnterior = fechaInicio.AddMonths(-1);
                var fechaFinAnterior = fechaFin.AddMonths(-1);

                var ingresosAnterior = await _appContext.Ingresos
                    .Where(i => i.FechaModificado >= fechaInicioAnterior && i.FechaModificado <= fechaFinAnterior && !i.isDeleted)
                    .ToListAsync();

                var gastosAnterior = await _appContext.Gastos
                    .Where(g => g.FechaModificado >= fechaInicioAnterior && g.FechaModificado <= fechaFinAnterior && !g.isDeleted)
                    .ToListAsync();

                var totalIngresosAnterior = ingresosAnterior.Sum(i => i.Monto);
                var totalGastosAnterior = gastosAnterior.Sum(g => g.Monto);
                var balanceAnterior = totalIngresosAnterior - totalGastosAnterior;

                // Cálculo de indicadores
                var cambioBalance = balance - balanceAnterior;
                var porcentajeCambioBalance = balanceAnterior == 0 ? 0 : (cambioBalance / balanceAnterior) * 100;

                var cambioIngresos = totalIngresos - totalIngresosAnterior;
                var porcentajeCambioIngresos = totalIngresosAnterior == 0 ? 0 : (cambioIngresos / totalIngresosAnterior) * 100;

                var cambioGastos = totalGastos - totalGastosAnterior;
                var porcentajeCambioGastos = totalGastosAnterior == 0 ? 0 : (cambioGastos / totalGastosAnterior) * 100;

                // Obtener los últimos 5 ingresos y 5 gastos, combinarlos en un solo array
                var ultimosIngresos = ingresos.Select(i => new { i.Monto, i.Nombre, i.FechaCreacion, tipo = "ingreso" })
                                              .OrderByDescending(i => i.FechaCreacion).Take(5);

                var ultimosGastos = gastos.Select(g => new { g.Monto, g.Nombre, g.FechaCreacion, tipo = "gasto" })
                                          .OrderByDescending(g => g.FechaCreacion).Take(5);

                var transaccionesRecientes = ultimosIngresos.Concat(ultimosGastos)
                                                           .OrderByDescending(t => t.FechaCreacion)
                                                           .ToList();
                // Estructura de la respuesta
                var resultado = new
                {
                    kpi = new
                    {
                        balance = new
                        {
                            value = balance,
                            percentage = porcentajeCambioBalance
                        },
                        ingresos = new
                        {
                            value = totalIngresos,
                            percentage = porcentajeCambioIngresos
                        },
                        gastos = new
                        {
                            value = totalGastos,
                            percentage = porcentajeCambioGastos
                        }
                    },
                    last = transaccionesRecientes
                };

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener los datos: {ex.Message}");
            }
        }

    }
}
