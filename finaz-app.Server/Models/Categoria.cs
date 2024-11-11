using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models
{
    public partial class Categoria
    {
        [BindNever]
        public int CategoriaId { get; set; }

        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

        [JsonIgnore]
        public bool isDeleted { get; set; } = false;

        [JsonIgnore]
        public bool isSystem { get; set; } = false;

        [JsonIgnore]
        public int CreadoPor { get; set; }

        [JsonIgnore]
        [BindNever]
        public DateTime FechaCreacion { get; set; }

        [JsonIgnore]
        public int? ModificadoPor { get; set; }

        [JsonIgnore]
        [BindNever]
        public DateTime? FechaModificado { get; set; }

        [JsonIgnore]
        public virtual Usuario? CreadoPorNavigation { get; set; }

        [JsonIgnore]
        public virtual Usuario? ModificadoPorNavigation { get; set; }

        [JsonIgnore]
        public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

        [JsonIgnore]
        public virtual ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();
    }
}
