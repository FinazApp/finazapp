namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para un usuario.
    /// </summary>
    public class UsuariosDTO
    {
        public int UsuarioId { get; set; }

        public string? Nombre { get; set; }

        public string? Correo { get; set; }
    }
}
