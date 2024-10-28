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

    public bool isDeleted { get; set; }  // Campo para indicar si el ingreso está eliminado

    public int? Estado { get; set; }  // Campo para indicar el estado del ingreso

    public string CreadoPor { get; set; } = null!;  // Campo para el usuario que creó el ingreso

    public DateTime FechaCreacion { get; set; }  // Campo para la fecha de creación

    public string? ModificadoPor { get; set; }  // Campo para el usuario que modificó el ingreso

    public DateTime? FechaModificado { get; set; }  // Campo para la fecha de modificación

    [JsonIgnore]
    public virtual Categoria? Categoria { get; set; }

    [JsonIgnore]
    public virtual Usuario? Usuario { get; set; }
}
