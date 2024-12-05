namespace finaz_app.Server.Models
{
    public class Login
    {
        public required string CorreoElectronico { get; set; }

        public required string PasswordHash { get; set; }
    }
}
