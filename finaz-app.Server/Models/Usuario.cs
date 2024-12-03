using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models
{
    public partial class Usuario
    {
        [BindNever]
        public int UsuarioId { get; set; }

        public required string Nombre { get; set; }

        public string? FotoPerfil { get; set; }

        public required string CorreoElectronico { get; set; }

        public required string PasswordHash { get; set; }

        [JsonIgnore]
        public string Rol { get; set; } = "User";

        [JsonIgnore]
        public virtual ICollection<Categoria> CategoriaCreadoPorNavigations { get; set; } = new List<Categoria>();

        [JsonIgnore]
        public virtual ICollection<Categoria> CategoriaModificadoPorNavigations { get; set; } = new List<Categoria>();

        [JsonIgnore]
        public virtual ICollection<Gasto> GastoCreadoPorNavigations { get; set; } = new List<Gasto>();

        [JsonIgnore]
        public virtual ICollection<Gasto> GastoModificadoPorNavigations { get; set; } = new List<Gasto>();

        [JsonIgnore]
        public virtual ICollection<Ingreso> IngresoCreadoPorNavigations { get; set; } = new List<Ingreso>();

        [JsonIgnore]
        public virtual ICollection<Ingreso> IngresoModificadoPorNavigations { get; set; } = new List<Ingreso>();
        
        [JsonIgnore]
        public virtual ICollection<MetaAhorro> MetaAhorroCreadoPorNavigations { get; set; } = new List<MetaAhorro>();

        [JsonIgnore]
        public virtual ICollection<MetaAhorro> MetaAhorroModificadoPorNavigations { get; set; } = new List<MetaAhorro>();
    }
}
