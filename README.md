# Actualización de Modelos y Creación de Generación de Reportes CSV

## Descripción

Esta actualización incluye dos cambios principales:
1. **Modificaciones en los Modelos**: Los modelos de la aplicación fueron actualizados conforme a los resultados de una auditoría realizada a la base de datos.
2. **Creación de Generación de Reportes CSV**: Implementación de un nuevo endpoint en el controlador `ReporteController` para generar un reporte CSV de ingresos y gastos en un rango de fechas específico.

---

## Cambios en los Modelos

Con base en la auditoría de la base de datos, se realizaron los siguientes cambios en los modelos **Usuario**, **Categoria**, **Gasto**, e **Ingreso**:
- **Campo `isDeleted`**: Añadido a cada modelo para marcar registros eliminados.
- **Campos de Auditoría**:
  - `CreadoPor` y `FechaCreacion`: Registran quién y cuándo se creó el registro.
  - `ModificadoPor` y `FechaModificado`: Registran quién y cuándo se modificó el registro.

Estos cambios permiten un seguimiento completo de cada registro en la base de datos y ayudan en el control de datos eliminados.

---

## Nuevo Endpoint: `GenerarReporteCsv`

### Descripción

El endpoint `/api/reporte/reporte-csv` permite generar un reporte en formato CSV que incluye todos los ingresos y gastos dentro de un rango de fechas específico.

### Detalles Técnicos

- **Método HTTP**: `GET`
- **Ruta**: `/api/reporte/reporte-csv`
- **Parámetros**:
  - `fechaInicio` (DateTime): Fecha de inicio del reporte.
  - `fechaFin` (DateTime): Fecha de fin del reporte.
  
- **Proceso**:
  1. Obtiene los ingresos y gastos dentro del rango de fechas proporcionado.
  2. Filtra los registros que no estén eliminados (`isDeleted = false`).
  3. Combina los ingresos y gastos en una sola lista y genera el archivo CSV.

- **Formato de CSV**:
  - El archivo contiene las siguientes columnas: `Tipo`, `Transacción`, `Monto`, `Categoría`, `Fecha`.

### Ejemplo de Llamada al Endpoint

```http
GET /api/reporte/reporte-csv?fechaInicio=2023-01-01&fechaFin=2023-12-31
