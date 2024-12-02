namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Representa un objeto de transferencia de datos (DTO) para una meta de ahorro.
    /// </summary>
    public class MetasAhorroDTO
    {
        public int MetaId { get; set; }

        public required string Nombre { get; set; }

        public decimal MontoObjetivo { get; set; }

        public decimal MontoAhorrado { get; set; } = 0;

        public DateTime FechaMeta { get; set; }
    }
}
