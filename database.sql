CREATE TABLE Usuarios (
    UsuarioId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    CorreoElectronico NVARCHAR(100) NOT NULL UNIQUE,
    Rol NVARCHAR(10) NOT NULL
);

CREATE TABLE Categorias (
    CategoriaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    isDeleted BIT NOT NULL DEFAULT 0,
    isSystem BIT NOT NULL DEFAULT 0,
    CreadoPor INT NULL,
    FechaCreacion DATETIME2 NOT NULL,
    ModificadoPor INT NULL,
    FechaModificado DATETIME2,
    FOREIGN KEY (CreadoPor) REFERENCES Usuarios(UsuarioId),
    FOREIGN KEY (ModificadoPor) REFERENCES Usuarios(UsuarioId)
);

ALTER TABLE Categorias ADD CONSTRAINT UQ_Nombre_CreadoPor UNIQUE (Nombre, CreadoPor);

CREATE TABLE Gastos (
    GastoId INT PRIMARY KEY IDENTITY(1,1),
    CategoriaId INT,
    Nombre NVARCHAR(100) NOT NULL,
    Monto DECIMAL(18, 2) NOT NULL CHECK (Monto >= 0),
    isDeleted BIT NOT NULL DEFAULT 0,
    CreadoPor INT NOT NULL,
    FechaCreacion DATETIME2 NOT NULL,
    ModificadoPor INT NULL,
    FechaModificado DATETIME2,
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(CategoriaId),
    FOREIGN KEY (CreadoPor) REFERENCES Usuarios(UsuarioId),
    FOREIGN KEY (ModificadoPor) REFERENCES Usuarios(UsuarioId)
);

CREATE TABLE Ingresos (
    IngresoId INT PRIMARY KEY IDENTITY(1,1),
    CategoriaId INT,
    Nombre NVARCHAR(100) NOT NULL,
    Monto DECIMAL(18, 2) NOT NULL CHECK (Monto >= 0),
    isDeleted BIT NOT NULL DEFAULT 0,
    CreadoPor INT NOT NULL,
    FechaCreacion DATETIME2 NOT NULL,
    ModificadoPor INT NULL,
    FechaModificado DATETIME2,
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(CategoriaId),
    FOREIGN KEY (CreadoPor) REFERENCES Usuarios(UsuarioId),
    FOREIGN KEY (ModificadoPor) REFERENCES Usuarios(UsuarioId)
);

CREATE TABLE MetasAhorro (
    MetaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    MontoObjetivo DECIMAL(18, 2) NOT NULL CHECK (MontoObjetivo > 0),
    MontoAhorrado DECIMAL(18, 2) NOT NULL DEFAULT 0,
    FechaMeta DATETIME2 NOT NULL,
    isDeleted BIT NOT NULL DEFAULT 0,
    CreadoPor INT NOT NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    ModificadoPor INT NULL,
    FechaModificado DATETIME2 NULL,
    FOREIGN KEY (CreadoPor) REFERENCES Usuarios(UsuarioId),
    FOREIGN KEY (ModificadoPor) REFERENCES Usuarios(UsuarioId),
    CONSTRAINT CHK_MontoAhorrado CHECK (MontoAhorrado <= MontoObjetivo)
);
