using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Linq;

namespace TuProyecto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReporteController : ControllerBase
    {
        private readonly TuDbContext _context;

        public ReporteController(TuDbContext context)
        {
            _context = context;
        }

        // Este es el nuevo endpoint para generar el reporte CSV
        [HttpGet("reporte-csv")]
        public IActionResult GenerarReporteCsv(DateTime fechaInicio, DateTime fechaFin)
        {
            // Obtén los ingresos en el rango de fechas
            var ingresos = _context.Ingresos
                .Where(i => i.FechaCreacion >= fechaInicio && i.FechaCreacion <= fechaFin && !i.isDeleted)
                .Select(i => new {
                    Tipo = "Ingreso",
                    Transaccion = i.Nombre,
                    Monto = i.Monto,
                    Categoria = i.Categoria.Nombre,
                    Fecha = i.FechaCreacion
                }).ToList();

            // Obtén los gastos en el rango de fechas
            var gastos = _context.Gastos
                .Where(g => g.FechaCreacion >= fechaInicio && g.FechaCreacion <= fechaFin && !g.isDeleted)
                .Select(g => new {
                    Tipo = "Gasto",
                    Transaccion = g.Nombre,
                    Monto = g.Monto,
                    Categoria = g.Categoria.Nombre,
                    Fecha = g.FechaCreacion
                }).ToList();

            // Combina los ingresos y gastos en un solo reporte
            var reporte = ingresos.Concat(gastos).ToList();

            // Generar el CSV
            var csv = new StringBuilder();
            csv.AppendLine("Tipo,Transacción,Monto,Categoría,Fecha");

            foreach (var item in reporte)
            {
                csv.AppendLine($"{item.Tipo},{item.Transaccion},{item.Monto},{item.Categoria},{item.Fecha}");
            }

            // Convertir el CSV a un array de bytes para enviarlo como archivo
            var byteArray = Encoding.UTF8.GetBytes(csv.ToString());

            // Retornar el archivo CSV
            return File(byteArray, "text/csv", "reporte.csv");
        }
    }
}
