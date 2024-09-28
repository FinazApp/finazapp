namespace finaz_app.Server.Models.DTOs
{
    public class CategoriasDTO
    {
        public int CategoriaId { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Descripcion { get; set; }

        public virtual UsuariosDTO? Usuario { get; set; }
    }
}
