using AutoMapper;
using finaz_app.Server.Models;
using finaz_app.Server.Security.JWT;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.ComponentModel;

namespace finaz_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        public async Task<IActionResult> GetDashboardSummary(DateTime inicio, DateTime fin)
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            try
            {
                // Sumar los ingresos del usuario
                var totalIngresos = await _context.Ingresos
                    .Where(i => i.CreadoPor == userID && !i.isDeleted && i.FechaCreacion >= inicio && i.FechaCreacion <= fin)
                    .SumAsync(i => i.Monto);

                // Sumar los gastos del usuario
                var totalGastos = await _context.Gastos
                    .Where(g => g.CreadoPor == userID && !g.isDeleted && g.FechaCreacion >= inicio && g.FechaCreacion <= fin)
                    .SumAsync(g => g.Monto);

                // Calcular el balance actual
                var balanceActual = totalIngresos - totalGastos;

                // calcular tendencia

                var tendenciaActual = totalGastos > totalIngresos ? "Negativa" : "Positiva";

                return Ok(new
                {
                    Dashboard = new
                    {
                        Balance = new
                        {
                            Value = balanceActual,
                            Tendencia = tendenciaActual
                        },
                        Ingresos = new
                        {
                            Total = totalIngresos
                        },
                        Gastos = new
                        {
                            Total = totalGastos
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        [HttpGet("ultimos-movimientos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UltimosMovimientosUser(DateTime fechaInicio, DateTime fechaFin)
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            try
            {
                var ingresos = await _context.Ingresos
                    .Where(i => i.CreadoPor == userID && !i.isDeleted && i.FechaCreacion >= fechaInicio && i.FechaCreacion <= fechaFin)
                    .OrderByDescending(i => i.FechaCreacion)
                    .Take(5)
                    .ToListAsync();

                var gastos = await _context.Gastos
                    .Where(g => g.CreadoPor == userID && !g.isDeleted && g.FechaCreacion >= fechaInicio && g.FechaCreacion <= fechaFin)
                    .OrderByDescending(g => g.FechaCreacion)
                    .Take(5)
                    .ToListAsync();

                var resultados = new
                {
                    Ingresos = new
                    {
                        Values = ingresos
                    },
                    Gastos = new
                    {
                        Values = gastos
                    }
                };

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en la API: {ex.Message}");
            }
        }

        /*
         * tomar todas las categorias de un usuario, ver cuantas cosas tiene el usuario asociado a esa categoria**/

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> TotalUserRelations()
        {
            var userID = JwtHelper.ObtenerIdDeJwt(HttpContext);
            if (userID == null)
            {
                return Unauthorized("No se ha proporcionado un JWT válido o el ID de usuario no es válido.");
            }

            var ingresos = await _context.Ingresos
            .Where(i => i.CreadoPor == userID && !i.isDeleted)
            .GroupBy(i => i.CategoriaId)
            .Select(g => new
            {
                Categoria = g.Key,
                TotalRelaciones = g.Count()
            })
            .ToListAsync();

            var gastos = await _context.Gastos
            .Where(i => i.CreadoPor == userID && !i.isDeleted)
            .GroupBy(i => i.CategoriaId)
            .Select(g => new
            {
                Categoria = g.Key,
                TotalRelaciones = g.Count()
            })
            .ToListAsync();

            var resultado = new
            {
               Ingresos = new
               {
                 Values = ingresos
               },

               Gastos = new
               {
                 Values = gastos
               }
            };

            return Ok(resultado);
        }
    }
}
