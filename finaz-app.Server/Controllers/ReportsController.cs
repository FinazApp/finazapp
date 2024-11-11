using finaz_app.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;

namespace finaz_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IWebHostEnvironment _environment;

        public ReportsController(FinanzAppContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("reporte-csv")]
        public IActionResult GenerarReporteCsv(DateOnly fechaInicio, DateOnly fechaFin)
        {
            if (fechaInicio == default || fechaFin == default)
            {
                return BadRequest("Por favor, proporciona una fecha de inicio y una fecha de fin válidas.");
            }

            var ingresos = _context.Ingresos
                .Where(i => i.FechaCreacion >= fechaInicio.ToDateTime(TimeOnly.MinValue) && 
                            i.FechaCreacion <= fechaFin.ToDateTime(TimeOnly.MaxValue) && 
                            !i.isDeleted)
                .Select(i => new {
                    Tipo = "Ingreso",
                    Transaccion = i.Nombre,
                    Monto = i.Monto,
                    Categoria = i.Categoria.Nombre ?? "Sin categoría",
                    Fecha = i.FechaCreacion
                }).ToList();

            var gastos = _context.Gastos
                .Where(g => g.FechaCreacion >= fechaInicio.ToDateTime(TimeOnly.MinValue) && 
                            g.FechaCreacion <= fechaFin.ToDateTime(TimeOnly.MaxValue) && 
                            !g.isDeleted)
                .Select(g => new {
                    Tipo = "Gasto",
                    Transaccion = g.Nombre,
                    Monto = g.Monto,
                    Categoria = g.Categoria.Nombre ?? "Sin categoría",
                    Fecha = g.FechaCreacion
                }).ToList();

            var reporte = ingresos.Concat(gastos).ToList();

            var csv = new StringBuilder();
            csv.AppendLine("Tipo,Transacción,Monto,Categoría,Fecha");

            foreach (var item in reporte)
            {
                csv.AppendLine($"{item.Tipo},{item.Transaccion},{item.Monto},{item.Categoria},{item.Fecha:yyyy-MM-dd}");
            }

            var fileName = $"reporte_{DateTime.Now:yyyyMMddHHmmss}.csv";
            var filePath = Path.Combine(_environment.WebRootPath, "reportes", fileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            System.IO.File.WriteAllText(filePath, csv.ToString(), Encoding.UTF8);

            var fileUrl = $"{Request.Scheme}://{Request.Host}/reportes/{fileName}";
            return Ok(new { url = fileUrl });
        }
    }
}
