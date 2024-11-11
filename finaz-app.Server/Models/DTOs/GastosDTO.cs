using System.ComponentModel.DataAnnotations;

namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para un gasto.
    /// </summary>
    public class GastosDTO
    {
        public int GastoId { get; set; }

        public int? CategoriaId { get; set; }

        public required string Nombre { get; set; }

        public decimal Monto { get; set; }
    }
}
