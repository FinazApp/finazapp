# **FinazApp** (RAMA `dev`)

**Finazapp** es una aplicación de gestión de finanzas personales que ayuda a los usuarios a gestionar sus ingresos y gastos mediante el análisis de hábitos de consumo. En la rama `dev`, el equipo de desarrollo trabaja en nuevas funcionalidades, optimiza el código y prepara futuras versiones que eventualmente serán desplegadas en la rama `main`.

### Objetivo del proyecto

El objetivo principal en la rama `dev` es continuar con el desarrollo y mejora continua del sistema. Se está trabajando en nuevas características que mejorarán la experiencia de usuario y proporcionarán recomendaciones financieras más precisas, basadas en datos y análisis detallados.

## Entregables actuales en desarrollo

### Diseño visual y experiencia de usuario (UX/UI)

- Se están realizando iteraciones sobre los **prototipos visuales**, incluyendo mejoras basadas en retroalimentación interna.
- Se están ajustando y optimizando la **interfaz de usuario** para mejorar la usabilidad.

### Desarrollo de nuevas funcionalidades

- **Mejoras en el dashboard principal**: Se están implementando gráficos más detallados y la capacidad de aplicar filtros avanzados.
- **Optimización del sistema de categorización de gastos**: Se está trabajando en un sistema de autocategorización mediante aprendizaje automático.
- **Sistema de alertas**: Se están desarrollando notificaciones automáticas para alertar a los usuarios sobre hábitos de gasto inusuales o incumplimiento de metas.
- **Soporte para múltiples cuentas**: Se está añadiendo la funcionalidad para gestionar múltiples fuentes de ingresos y cuentas bancarias.
- **Mejoras en el seguimiento de ingresos y gastos**: Se está integrando la importación automática de transacciones a través de APIs de terceros.

### Módulos de interacción en desarrollo

- **Autenticación mejorada**: Se está implementando autenticación mediante OAuth para mayor seguridad.
- **Ajustes de privacidad avanzados**: Se está trabajando en la capacidad de personalizar más profundamente la configuración de privacidad.

### Pruebas y validación

- Las pruebas unitarias y de integración se realizan con **Jest**, **React Testing Library** y **Cypress** en el frontend.
- En el backend, se están ejecutando pruebas con **xUnit** y **TestServer**.
- Se utiliza **Postman** para validar los endpoints y asegurar su correcto funcionamiento.

## Estado de desarrollo

Esta rama `dev` es el entorno de desarrollo activo, donde se prueban y validan nuevas funcionalidades antes de ser fusionadas con la rama `main`. Aquí se llevan a cabo pruebas automatizadas y se realizan las mejoras necesarias para garantizar la estabilidad y funcionalidad del sistema.

## Instrucciones para desarrolladores

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/FinazApp/finazapp
    ```

2. Cambiar a la rama `dev`:
    ```bash
    git checkout dev
    ```

3. Instalar las dependencias del frontend:
    ```bash
    cd frontend
    npm install
    ```

4. Instalar las dependencias del backend:
    ```bash
    cd backend
    dotnet restore
    ```

5. Ejecutar el proyecto en modo desarrollo:
    - **Frontend**: 
        ```bash
        npm start
        ```
    - **Backend**:
        ```bash
        dotnet run
        ```

## Tecnologías y herramientas

- **Frontend**: React.js + TypeScript
- **Backend**: ASP.NET Core
- **Base de datos**: SQL Server LocalDB
- **Pruebas**: Jest, React Testing Library, Cypress, xUnit, TestServer, Postman

## Repositorio y gestión

- **Repositorio GitHub**: [Enlace al repositorio](https://github.com/FinazApp/finazapp)
- **Gestión de tareas**: Jira

---

Este archivo README corresponde a la rama `dev`, donde se realizan las nuevas implementaciones y pruebas antes de ser lanzadas a producción.
