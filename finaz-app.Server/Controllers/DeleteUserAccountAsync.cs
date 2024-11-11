using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace finaz_app.Server.Controllers
{
    public class DeleteUserAccountController : ControllerBase // La clase debe ser pública
    {
        private readonly FinanzAppContext _dbContext;

        public DeleteUserAccountController(FinanzAppContext dbContext) // Constructor público
        {
            _dbContext = dbContext;
        }

        public async Task<bool> DeleteUserAccountAsync(string userId) // Método público
        {
            try
            {
                var user = await _dbContext.Users
                    .Include(u => u.CategoriaCreadoPorNavigations)
                    .Include(u => u.CategoriaModificadoPorNavigations)
                    .Include(u => u.GastoCreadoPorNavigations)
                    .Include(u => u.IngresoCreadoPorNavigations)
                    .FirstOrDefaultAsync(u => u.UsuarioId == userId);

                if (user == null) return false;

                _dbContext.Categorias.RemoveRange(user.CategoriaCreadoPorNavigations);
                _dbContext.Categorias.RemoveRange(user.CategoriaModificadoPorNavigations);
                _dbContext.Gastos.RemoveRange(user.GastoCreadoPorNavigations);
                _dbContext.Ingresos.RemoveRange(user.IngresoCreadoPorNavigations);

                _dbContext.Users.Remove(user);

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
