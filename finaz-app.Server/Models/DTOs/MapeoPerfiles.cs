using AutoMapper;

namespace finaz_app.Server.Models.DTOs
{
    public class MapeoPerfiles : Profile
    {
        public MapeoPerfiles()
        {
            CreateMap<Usuario, UsuariosDTO>();
            CreateMap<Gasto, GastosDTO>();
            CreateMap<Ingreso, IngresosDTO>();
            CreateMap<Categoria, CategoriasDTO>();
        }
    }
}
