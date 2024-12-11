using AutoMapper;
using finaz_app.Server.Models;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace finaz_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IMapper _mapper;

        public DashboardController(FinanzAppContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("Summary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PanelPrincipal(string inicioFecha, string finFecha)
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            try
            {
                // Parsear las fechas
                var inicio = DateTime.ParseExact(inicioFecha, "dd/MM/yyyy", null);
                var fin = DateTime.ParseExact(finFecha, "dd/MM/yyyy", null);

                // Datos en el rango
                var metasAhorros = await _context.MetasAhorro
                    .Where(m => m.CreadoPor == userID && !m.isDeleted && m.FechaCreacion >= inicio && m.FechaCreacion <= fin)
                    .ToListAsync();

                var ingresosRango = await _context.Ingresos
                    .Where(i => i.CreadoPor == userID && !i.isDeleted && i.FechaCreacion >= inicio && i.FechaCreacion <= fin)
                    .ToListAsync();

                var gastosRango = await _context.Gastos
                    .Where(g => g.CreadoPor == userID && !g.isDeleted && g.FechaCreacion >= inicio && g.FechaCreacion <= fin)
                    .ToListAsync();

                // Datos fuera del rango (solo del pasado)
                var ingresosPasado = await _context.Ingresos
                    .Where(i => i.CreadoPor == userID && !i.isDeleted && i.FechaCreacion < inicio)
                    .ToListAsync();

                var gastosPasado = await _context.Gastos
                    .Where(g => g.CreadoPor == userID && !g.isDeleted && g.FechaCreacion < inicio)
                    .ToListAsync();

                // Calcular totales y balance
                var totalIngresosRango = ingresosRango.Sum(i => i.Monto);
                var totalGastosRango = gastosRango.Sum(g => g.Monto);
                var totalMetasAhorrosRango = metasAhorros.Sum(g => g.MontoAhorrado);
                var balanceRango = (totalIngresosRango - totalGastosRango) - totalMetasAhorrosRango;

                var totalIngresosPasado = ingresosPasado.Sum(i => i.Monto);
                var totalGastosPasado = gastosPasado.Sum(g => g.Monto);
                var balancePasado = totalIngresosPasado - totalGastosPasado;

                // Calcular porcentajes de cambio
                var cambioIngresos = CalcularCambioPorcentual(totalIngresosRango, totalIngresosPasado);
                var cambioGastos = CalcularCambioPorcentual(totalGastosRango, totalGastosPasado);
                var cambioBalance = CalcularCambioPorcentual(balanceRango, balancePasado);

                // Últimos 10 movimientos
                var ultimosMovimientos = ingresosRango
                    .Select(i => new { i.Nombre, i.Monto, Tipo = "Ingreso", i.FechaCreacion })
                    .Concat(gastosRango.Select(g => new { g.Nombre, g.Monto, Tipo = "Gasto", g.FechaCreacion }))
                    .Concat(metasAhorros.Select(m => new { m.Nombre, Monto = m.MontoAhorrado, Tipo = "Fondo de Meta de Ahorro", m.FechaCreacion }))
                    .OrderByDescending(m => m.FechaCreacion)
                    .Take(10)
                    .ToList();

                // Categorías usadas
                var categoriasIngresos = ingresosRango
                    .GroupBy(i => i.CategoriaId)
                    .Select(g => new { Categoria = g.Key, Total = g.Count() })
                    .ToList();

                var categoriasGastos = gastosRango
                    .GroupBy(g => g.CategoriaId)
                    .Select(g => new { Categoria = g.Key, Total = g.Count() })
                    .ToList();

                var categoriasUsadas = categoriasIngresos.Concat(categoriasGastos)
                    .GroupBy(c => c.Categoria)
                    .Select(g => new { Categoria = g.Key, Total = g.Sum(x => x.Total) })
                    .ToList();

                // Respuesta
                return Ok(new
                {
                    Totales = new
                    {
                        Ingresos = totalIngresosRango,
                        Gastos = totalGastosRango,
                        Balance = balanceRango
                    },
                    Porcentajes = new
                    {
                        Ingresos = cambioIngresos,
                        Gastos = cambioGastos,
                        Balance = cambioBalance
                    },
                    UltimosMovimientos = ultimosMovimientos,
                    CategoriasUsadas = categoriasUsadas
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        private static object CalcularCambioPorcentual(decimal actual, decimal pasado)
        {
            // Si ambos valores son cero, el cambio porcentual es neutro.
            if (pasado == 0 && actual == 0)
                return new { Porcentaje = 0, Tipo = "Neutro" };

            // Si el pasado es cero y el actual no lo es, el porcentaje es 100% positivo o negativo
            if (pasado == 0)
                return new { Porcentaje = 100, Tipo = actual > 0 ? "Positivo" : "Negativo" };

            // Calcular el porcentaje de cambio
            var cambio = ((actual - pasado) / Math.Abs(pasado)) * 100;

            // Determinar si es positivo o negativo con base en el signo del cambio y el balance actual
            var tipo = cambio >= 0 ? "Positivo" : "Negativo";

            return new { Porcentaje = Math.Round(cambio, 2), Tipo = tipo };
        }

    }
}
