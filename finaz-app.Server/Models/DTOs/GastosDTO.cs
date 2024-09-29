namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para un gasto.
    /// </summary>
    public class GastosDTO
    {
        public int GastosId { get; set; }

        public string? Nombre { get; set; }

        public decimal? Monto { get; set; }

        public virtual UsuariosDTO? Usuario { get; set; }

        public virtual CategoriasDTO? Categoria { get; set; }
    }
}
