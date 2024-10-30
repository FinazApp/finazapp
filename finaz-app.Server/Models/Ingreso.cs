using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

public partial class Ingreso
{
    [BindNever]
    public int IngresosId { get; set; }

    public int? CreadoPor { get; set; }

    public int? CategoriaId { get; set; }

    public string? Nombre { get; set; }

    public decimal? Monto { get; set; }

    public int? Estado { get; set; }

    [NotMapped]
    public bool IsDeleted => Estado == 0;

    [BindNever]
    public DateOnly? FechaCreacion { get; set; }

    public int? ModificadoPor { get; set; }
    [BindNever]
    public DateOnly? FechaModificado { get; set; }
    [JsonIgnore]
    public virtual Categoria? Categoria { get; set; }
    [JsonIgnore]
    public virtual Usuario? CreadoPorNavigation { get; set; }
    [JsonIgnore]
    public virtual Usuario? ModificadoPorNavigation { get; set; }
}
