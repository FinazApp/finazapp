using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

public partial class Categoria
{
    [BindNever]
    public int CategoriaId { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public int? Estado { get; set; }

    public int? UsuarioId { get; set; }

    [JsonIgnore]
    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

    [JsonIgnore]
    public virtual ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();

    [JsonIgnore]
    public virtual Usuario? Usuario { get; set; }
}
