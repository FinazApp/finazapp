using finaz_app.Server.Models;
using Microsoft.EntityFrameworkCore;

public class Restore
{
    private readonly FinanzAppContext _context;

    public Restore(FinanzAppContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<(int statusCode, string message)> RestoreEntity<TEntity>(
        int id,
        int userId,
        string entityName,
        string objective) where TEntity : class
    {
        try
        {
            // Verificar si las propiedades requeridas existen en la entidad
            var entityType = typeof(TEntity);
            if (entityType.GetProperty(objective) == null ||
                entityType.GetProperty("CreadoPor") == null ||
                entityType.GetProperty("isDeleted") == null)
            {
                return (500, $"Error: Las propiedades requeridas no existen en {entityType.Name}");
            }

            // Buscar la entidad
            var entity = await _context.Set<TEntity>()
                .FirstOrDefaultAsync(e => EF.Property<int>(e, $"{objective}") == id &&
                                          EF.Property<int>(e, "CreadoPor") == userId &&
                                          EF.Property<bool>(e, "isDeleted"));

            if (entity == null)
            {
                return (404, $"No se encontró el {entityName} eliminado para el usuario.");
            }

            // Restaurar la entidad
            entityType.GetProperty("isDeleted")?.SetValue(entity, false);

            await _context.SaveChangesAsync();

            return (200, $"{entityName} restaurado correctamente.");
        }
        catch (Exception ex)
        {
            return (500, $"Error en la API: {ex.Message}");
        }
    }
}
