using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models
{
    /// <summary>
    /// Representa un gasto en la aplicación.
    /// </summary>
    public partial class Gasto
    {
        [BindNever]
        public int GastosId { get; set; }

        public int? UsuarioId { get; set; }

        public int? CategoriaId { get; set; }

        public string? Nombre { get; set; }

        public decimal? Monto { get; set; }

        public bool isDeleted { get; set; }  // Campo para indicar si el gasto está eliminado

        public string CreadoPor { get; set; } = null!;  // Campo para el usuario que creó el gasto

        public DateTime FechaCreacion { get; set; }  // Campo para la fecha de creación

        public string? ModificadoPor { get; set; }  // Campo para el usuario que modificó el gasto

        public DateTime? FechaModificado { get; set; }  // Campo para la fecha de modificación

        [JsonIgnore]
        public virtual Categoria? Categoria { get; set; }

        [JsonIgnore]
        public virtual Usuario? Usuario { get; set; }
    }
}
