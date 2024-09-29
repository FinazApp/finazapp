using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;
/// <summary>
/// Representa un usuario en la aplicación.
/// </summary>
public partial class Usuario
{
    [BindNever]
    public int UsuarioId { get; set; }

    public string? Nombre { get; set; }

    public string? Correo { get; set; }

    public string? PasswordHash { get; set; }

    public int? Estado { get; set; }
    public string? Rol { get; set; }

    [JsonIgnore]
    public virtual ICollection<Categoria> Categoria { get; set; } = new List<Categoria>();

    [JsonIgnore]
    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

    [JsonIgnore]
    public virtual ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();
}
