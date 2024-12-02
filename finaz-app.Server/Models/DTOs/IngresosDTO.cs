using System.ComponentModel.DataAnnotations;

namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para un ingreso.
    /// </summary>
    public class IngresosDTO
    {
        public int IngresoId { get; set; }

        public int? CategoriaId { get; set; }

        public virtual Categoria? Categoria { get; set; }

        public required string Nombre { get; set; }

        public bool isDeleted { get; set; } = false;

        [Range(0, double.MaxValue)]
        public decimal Monto { get; set; }
    }
}
