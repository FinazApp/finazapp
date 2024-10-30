namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para un usuario.
    /// </summary>
    public class UsuariosDTO
    {
        public int UsuarioId { get; set; }

        public required string Nombre { get; set; }

        public required string CorreoElectronico { get; set; }

        public required string PasswordHash { get; set; }

        public required string Rol { get; set; }
        
        public bool isDeleted { get; set; } = false;
    }
}
