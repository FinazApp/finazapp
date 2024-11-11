using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using finaz_app.Server.Models; 

public async Task<bool> DeleteUserAccountAsync(string userId)
{
    try
    {
        // Buscar el usuario por su ID
        var user = await _dbContext.Users
            .Include(u => u.CategoriaCreadoPorNavigations)
            .Include(u => u.CategoriaModificadoPorNavigations)
            .Include(u => u.GastoCreadoPorNavigations)
            .Include(u => u.IngresoCreadoPorNavigations)
            .FirstOrDefaultAsync(u => u.UsuarioId == userId);

        if (user == null)
        {
            return false;
        }

        // Eliminar todas las relaciones del usuario
        _dbContext.Categorias.RemoveRange(user.CategoriaCreadoPorNavigations);
        _dbContext.Categorias.RemoveRange(user.CategoriaModificadoPorNavigations);
        _dbContext.Gastos.RemoveRange(user.GastoCreadoPorNavigations);
        _dbContext.Ingresos.RemoveRange(user.IngresoCreadoPorNavigations);

        // Eliminar el usuario
        _dbContext.Users.Remove(user);

        // Guardar los cambios en la base de datos
        await _dbContext.SaveChangesAsync();
        return true;
    }
    catch (Exception)
    {
        return false;
    }
}
