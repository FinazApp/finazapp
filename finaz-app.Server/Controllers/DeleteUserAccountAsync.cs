using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace finaz_app.Server.Controllers
{
    public class DeleteUserAccountController : ControllerBase 
    {
<<<<<<< HEAD
        private readonly FinanzAppContext _dbContext;
=======
        var user = await _dbContext.Usuarios // Cambiado a 'Usuarios' para coincidir con el DbSet
            .Include(u => u.CategoriaCreadoPorNavigations)
            .Include(u => u.CategoriaModificadoPorNavigations)
            .Include(u => u.GastoCreadoPorNavigations)
            .Include(u => u.IngresoCreadoPorNavigations)
            .FirstOrDefaultAsync(u => u.UsuarioId == userId);
>>>>>>> bc22ddb (dbset usuarios)

        public DeleteUserAccountController(FinanzAppContext dbContext) // Constructor público
        {
<<<<<<< HEAD
            _dbContext = dbContext;
=======
            return false; // Si el usuario no existe, retornar false
>>>>>>> bc22ddb (dbset usuarios)
        }

        public async Task<bool> DeleteUserAccountAsync(string userId) // Método público
        {
            try
            {
                var user = await _dbContext.Usuarios // Cambiado a 'Usuarios' para coincidir con el DbSet
                    .Include(u => u.CategoriaCreadoPorNavigations)
                    .Include(u => u.CategoriaModificadoPorNavigations)
                    .Include(u => u.GastoCreadoPorNavigations)
                    .Include(u => u.IngresoCreadoPorNavigations)
                    .FirstOrDefaultAsync(u => u.UsuarioId == userId);

                if (user == null)
                {
                    return false; // Si el usuario no existe, retornar false
                }

                // Eliminar todas las relaciones del usuario
                _dbContext.Categorias.RemoveRange(user.CategoriaCreadoPorNavigations);
                _dbContext.Categorias.RemoveRange(user.CategoriaModificadoPorNavigations);
                _dbContext.Gastos.RemoveRange(user.GastoCreadoPorNavigations);
                _dbContext.Ingresos.RemoveRange(user.IngresoCreadoPorNavigations);

                // Eliminar el usuario
                _dbContext.Usuarios.Remove(user); // Asegúrate de usar 'Usuarios' aquí también

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
=======
        // Eliminar el usuario
        _dbContext.Usuarios.Remove(user); // Asegúrate de usar 'Usuarios' aquí también

        await _dbContext.SaveChangesAsync();

        return true;
    }
    catch (Exception)
    {
        return false;
>>>>>>> bc22ddb (dbset usuarios)
    }
}
