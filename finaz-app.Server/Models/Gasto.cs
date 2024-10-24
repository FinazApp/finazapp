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

        public int? Estado { get; set; }

        // Nueva propiedad para la fecha de creación del gasto
        public DateTime FechaCreacion { get; set; }

        // Nueva propiedad para indicar si el registro está eliminado
        public bool isDeleted { get; set; }

        [JsonIgnore]
        public virtual Categoria? Categoria { get; set; }

        [JsonIgnore]
        public virtual Usuario? Usuario { get; set; }
    }
}
