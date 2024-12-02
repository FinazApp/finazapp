using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace finaz_app.Server.Models
{
    public partial class MetaAhorro
    {
        [BindNever]
        public int MetaId { get; set; }

        public required string Nombre { get; set; }

        public decimal MontoObjetivo { get; set; }

        public decimal MontoAhorrado { get; set; } = 0;

        public DateTime FechaMeta { get; set; }

        [JsonIgnore]
        public bool isDeleted { get; set; } = false;

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
    }
}
