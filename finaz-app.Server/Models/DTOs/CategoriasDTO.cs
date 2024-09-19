namespace finaz_app.Server.Models.DTOs
{
    public class CategoriasDTO
    {
        public int CategoriaId { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Tipo { get; set; }

        public string? Descripcion { get; set; }
    }
}
