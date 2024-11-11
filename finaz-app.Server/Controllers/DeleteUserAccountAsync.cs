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
        private readonly FinanzAppContext _dbContext;

        public DeleteUserAccountController(FinanzAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> DeleteUserAccountAsync(string userId)
        {
            try
            {
                // Convertir userId de string a int
                if (!int.TryParse(userId, out int parsedUserId))
                {
                    // Si userId no se puede convertir a int, retorna false
                    return false;
                }

                var user = await _dbContext.Usuarios
                    .Include(u => u.CategoriaCreadoPorNavigations)
                    .Include(u => u.CategoriaModificadoPorNavigations)
                    .Include(u => u.GastoCreadoPorNavigations)
                    .Include(u => u.IngresoCreadoPorNavigations)
                    .FirstOrDefaultAsync(u => u.UsuarioId == parsedUserId);

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
                _dbContext.Usuarios.Remove(user);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
