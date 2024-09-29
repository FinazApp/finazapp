using AutoMapper;

namespace finaz_app.Server.Models.DTOs
{
    /// <summary>
    /// Configura los perfiles de mapeo para AutoMapper entre entidades y objetos DTO.
    /// </summary>
    public class MapeoPerfiles : Profile
    {
        /// <summary>
        /// Inicializa una nueva instancia de la clase <see cref="MapeoPerfiles"/>.
        /// </summary>
        public MapeoPerfiles()
        {
            // Mapeo entre las entidades y sus respectivos DTOs
            CreateMap<Usuario, UsuariosDTO>();
            CreateMap<Gasto, GastosDTO>();
            CreateMap<Ingreso, IngresosDTO>();
            CreateMap<Categoria, CategoriasDTO>();
        }
    }
}
