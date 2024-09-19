using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

public partial class Gasto
{
    [BindNever]
    public int GastosId { get; set; }

    public int? UsuarioId { get; set; }

    public int? CategoriaId { get; set; }

    public string? Nombre { get; set; }

    public decimal? Monto { get; set; }

    public int? Estado { get; set; }
    [JsonIgnore]
    public virtual Categoria? Categoria { get; set; }
    [JsonIgnore]
    public virtual Usuario? Usuario { get; set; }
}
