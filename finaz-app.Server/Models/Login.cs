namespace finaz_app.Server.Models
{
    public class Login
    {
        public required string Email { get; set; }
        public required string HashContraseña { get; set; }
    }
}
