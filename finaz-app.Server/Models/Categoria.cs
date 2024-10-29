using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

public partial class Categoria
{
    [BindNever]
    public int CategoriaId { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public int Estado { get; set; }

    [NotMapped]
    public bool IsDeleted => Estado == 1;

    public int? CreadoPor { get; set; }
    [BindNever]
    public DateTime? FechaCreacion { get; set; }

    public int? ModificadoPor { get; set; }
    [BindNever]
    public DateTime? FechaModificado { get; set; }
    [JsonIgnore]
    public virtual Usuario? CreadoPorNavigation { get; set; }
    [JsonIgnore]
    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();
    [JsonIgnore]
    public virtual ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();
    [JsonIgnore]
    public virtual Usuario? ModificadoPorNavigation { get; set; }
}
