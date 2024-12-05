CREATE PROCEDURE EliminarUsuario
    @UsuarioId INT
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DELETE FROM Gastos WHERE CreadoPor = @UsuarioId;

        DELETE FROM Ingresos WHERE CreadoPor = @UsuarioId;

        DELETE FROM Categorias WHERE CreadoPor = @UsuarioId;

        DELETE FROM Usuarios WHERE UsuarioId = @UsuarioId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
