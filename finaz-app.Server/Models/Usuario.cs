using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

public partial class Usuario
{
    [BindNever]
    [JsonIgnore]
    public int UsuarioId { get; set; }

    public string? Nombre { get; set; }

    public string? Correo { get; set; }

    public string? PasswordHash { get; set; }

    public int? Estado { get; set; }

    public string? Rol { get; set; }

    [JsonIgnore]
    public virtual ICollection<Categoria> CategoriaCreadoPorNavigations { get; set; } = new List<Categoria>();
    
    [JsonIgnore]
    public virtual ICollection<Categoria> CategoriaModificadoPorNavigations { get; set; } = new List<Categoria>();
    
    [JsonIgnore]
    public virtual ICollection<Categoria> CategoriaUsuarios { get; set; } = new List<Categoria>();
    
    [JsonIgnore]
    public virtual ICollection<Gasto> GastoCreadoPorNavigations { get; set; } = new List<Gasto>();
    
    [JsonIgnore]
    public virtual ICollection<Gasto> GastoModificadoPorNavigations { get; set; } = new List<Gasto>();
    
    [JsonIgnore]
    public virtual ICollection<Gasto> GastoUsuarios { get; set; } = new List<Gasto>();
    
    [JsonIgnore]
    public virtual ICollection<Ingreso> IngresoCreadoPorNavigations { get; set; } = new List<Ingreso>();
    
    [JsonIgnore]
    public virtual ICollection<Ingreso> IngresoModificadoPorNavigations { get; set; } = new List<Ingreso>();
    
    [JsonIgnore]
    public virtual ICollection<Ingreso> IngresoUsuarios { get; set; } = new List<Ingreso>();
}
