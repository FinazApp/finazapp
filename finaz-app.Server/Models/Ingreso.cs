using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

/// <summary>
/// Representa un ingreso en la aplicación.
/// </summary>
public partial class Ingreso
{
    [BindNever]
    public int IngresosId { get; set; }

    public int? UsuarioId { get; set; }

    public int? CategoriaId { get; set; }

    public string? Nombre { get; set; }

    public decimal? Monto { get; set; }

    public int? Estado { get; set; }

    public int? CreadoPor { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public int? ModificadoPor { get; set; }

    public DateTime? FechaModificado { get; set; }

    public virtual Categoria? Categoria { get; set; }

    public virtual Usuario? CreadoPorNavigation { get; set; }

    public virtual Usuario? ModificadoPorNavigation { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
