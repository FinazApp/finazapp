using finaz_app.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;

/*

namespace finaz_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly FinanzAppContext _context;
        private readonly IWebHostEnvironment _environment; // Inyección del entorno para obtener el directorio web

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

            // Obtener ingresos y gastos en el rango de fechas
            var ingresos = _context.Ingresos
                .Where(i => i.FechaCreacion >= fechaInicio && i.FechaCreacion <= fechaFin && i.Estado != 0)
                .Select(i => new {
                    Tipo = "Ingreso",
                    Transaccion = i.Nombre,
                    Monto = i.Monto,
                    Categoria = i.Categoria.Nombre ?? "Sin categoría",
                    Fecha = i.FechaCreacion
                }).ToList();

            var gastos = _context.Gastos
                .Where(g => g.FechaCreacion >= fechaInicio && g.FechaCreacion <= fechaFin && g.Estado != 0)
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

            // Crear el archivo temporal y guardar el CSV
            var fileName = $"reporte_{DateTime.Now:yyyyMMddHHmmss}.csv";
            var filePath = Path.Combine(_environment.WebRootPath, "reportes", fileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)); // Asegura que el directorio exista
            System.IO.File.WriteAllText(filePath, csv.ToString(), Encoding.UTF8);

            // Retorna la URL del archivo
            var fileUrl = $"{Request.Scheme}://{Request.Host}/reportes/{fileName}";
            return Ok(new { url = fileUrl });
        }
    }
}

*/
