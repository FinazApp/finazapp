namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para una categoría.
    /// </summary>
    public class CategoriasDTO
    {
        public int CategoriaId { get; set; }

        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

        public bool isDeleted { get; set; } = false;
    }
}
