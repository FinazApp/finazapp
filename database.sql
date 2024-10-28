CREATE TABLE Usuarios (
    UsuarioId INT PRIMARY KEY,
    Nombre NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    CorreoElectronico NVARCHAR(255) NOT NULL,
    isDeleted BIT NOT NULL
);

CREATE TABLE Categorias (
    CategoriaId INT PRIMARY KEY,
    Nombre NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(255),
    isDeleted BIT NOT NULL,
    isSystem BIT NOT NULL,
    UsuarioId INT,
    CreadoPor NVARCHAR(255) NOT NULL,
    FechaCreacion DATETIME NOT NULL,
    ModificadoPor NVARCHAR(255),
    FechaModificado DATETIME,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(UsuarioId)
);
ALTER TABLE Categorias ADD CONSTRAINT UQ_Nombre_UsuarioId UNIQUE (Nombre, UsuarioId)

CREATE TABLE Gastos (
    GastoId INT PRIMARY KEY,
    CategoriaId INT,
    Nombre NVARCHAR(255) NOT NULL,
    Monto DECIMAL(18, 2) NOT NULL,
    isDeleted BIT NOT NULL,
    CreadoPor NVARCHAR(255) NOT NULL,
    FechaCreacion DATETIME NOT NULL,
    ModificadoPor NVARCHAR(255),
    FechaModificado DATETIME,
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(CategoriaId)
);

CREATE TABLE Ingresos (
    IngresoId INT PRIMARY KEY,
    CategoriaId INT,
    Nombre NVARCHAR(255) NOT NULL,
    Monto DECIMAL(18, 2) NOT NULL,
    isDeleted BIT NOT NULL,
    CreadoPor NVARCHAR(255) NOT NULL,
    FechaCreacion DATETIME NOT NULL,
    ModificadoPor NVARCHAR(255),
    FechaModificado DATETIME,
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(CategoriaId)
);
