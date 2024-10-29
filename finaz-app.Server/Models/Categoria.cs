using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models;

/// <summary>
/// Representa una categoría de gastos o ingresos en la aplicación.
/// </summary>
public partial class Categoria
{
    [BindNever]
    public int CategoriaId { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public bool isDeleted { get; set; }  // Nuevo campo para indicar si la categoría está eliminada

    public bool isSystem { get; set; }  // Nuevo campo para identificar si es una categoría del sistema

    public int? UsuarioId { get; set; }

    public string CreadoPor { get; set; } = null!;  // Nuevo campo para el usuario que creó la categoría

    public DateTime FechaCreacion { get; set; }  // Nuevo campo para la fecha de creación

    public string? ModificadoPor { get; set; }  // Nuevo campo para el usuario que modificó la categoría

    public DateTime? FechaModificado { get; set; }  // Nuevo campo para la fecha de modificación

    [JsonIgnore]
    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

    [JsonIgnore]
    public virtual ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();

    [JsonIgnore]
    public virtual Usuario? Usuario { get; set; }
}
