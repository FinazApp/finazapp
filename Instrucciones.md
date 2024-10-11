
# Instrucciones para Configurar el Proyecto

## Clonación del Repositorio

1. **Clona el repositorio** en tu máquina local utilizando el siguiente comando:

   ```bash
   git clone https://github.com/FinazApp/finazapp/Emely/Docker
   cd tu_repositorio
   ```

## Configuración de la Cadena de Conexión

2. **Cambia la cadena de conexión** en el archivo `appsettings.json` para que apunte a tu instancia de SQL Server. Busca la sección `"ConnectionStrings"` y modifica la cadena de conexión como se muestra a continuación:

   ```json
   "ConnectionStrings": {
       "AppConnection": "data source=host.docker.internal\\[NOMBRE DE TU INSTANCIA DE SQL SERVER],1433;initial catalog=FinanzApp;User Id=sa;Password=453534fe3QEFFE;Encrypt=false;TrustServerCertificate=true;MultipleActiveResultSets=true"
   }
   ```

   Asegúrate de reemplazar `[NOMBRE DE TU INSTANCIA DE SQL SERVER]` con el nombre de tu instancia y el "1433" es un puerto que sql server expone, si no se te conecta me dices.

## Configuración del Usuario de SQL Server

3. **Verifica o configura el usuario `sa` en SQL Server**. Si no tienes habilitado el usuario `sa`, sigue estos pasos:

   - Abre **SQL Server Management Studio** (SSMS).
   - Navega a **Seguridad** -> **Logins**.
   - Busca un usuario llamado `sa`. Haz clic derecho sobre él y selecciona **Propiedades**.
   - En la sección **General**, habilita la **autenticación de SQL Server** y establece una contraseña de tu elección.
   - En la sección **Status**, habilita el **login**.

   > **Nota**: Este es un paso provisional hasta que se suba la imagen de la base de datos.

## Ejecución del Proyecto

4. Abre el proyecto en **Visual Studio 2022** y presiona **F5** para ejecutar la API. Visual Studio se encargará de construir el contenedor Docker y ejecutar la aplicación.

¡Listo! Ahora deberías poder trabajar con el proyecto sin problemas.
