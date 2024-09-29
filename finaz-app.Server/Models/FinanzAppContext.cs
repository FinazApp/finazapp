using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace finaz_app.Server.Models
{
    /// <summary>
    /// Proporciona acceso a los datos de la aplicación a través de Entity Framework Core.
    /// </summary>
    public partial class FinanzAppContext : DbContext
    {
        /// <summary>
        /// Inicializa una nueva instancia de la clase <see cref="FinanzAppContext"/>.
        /// </summary>
        public FinanzAppContext()
        {
        }

        /// <summary>
        /// Inicializa una nueva instancia de la clase <see cref="FinanzAppContext"/> con opciones de configuración.
        /// </summary>
        /// <param name="options">Opciones de configuración para el contexto de la base de datos.</param>
        public FinanzAppContext(DbContextOptions<FinanzAppContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Obtiene o establece la colección de categorías en la base de datos.
        /// </summary>
        public virtual DbSet<Categoria> Categorias { get; set; }

        /// <summary>
        /// Obtiene o establece la colección de gastos en la base de datos.
        /// </summary>
        public virtual DbSet<Gasto> Gastos { get; set; }

        /// <summary>
        /// Obtiene o establece la colección de ingresos en la base de datos.
        /// </summary>
        public virtual DbSet<Ingreso> Ingresos { get; set; }

        /// <summary>
        /// Obtiene o establece la colección de usuarios en la base de datos.
        /// </summary>
        public virtual DbSet<Usuario> Usuarios { get; set; }

        /// <summary>
        /// Configura las opciones del contexto de la base de datos.
        /// </summary>
        /// <param name="optionsBuilder">El constructor de opciones para configurar el contexto.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer("Name=ConnectionStrings:AppConnection");

        /// <summary>
        /// Configura el modelo de la base de datos utilizando el <see cref="ModelBuilder"/>.
        /// </summary>
        /// <param name="modelBuilder">El objeto <see cref="ModelBuilder"/> utilizado para configurar el modelo.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.CategoriaId).HasName("CAT_CategoriaID_PK");

                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
                entity.Property(e => e.Descripcion).HasMaxLength(100);
                entity.Property(e => e.Nombre).HasMaxLength(100);
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.HasOne(d => d.Usuario).WithMany(p => p.Categoria)
                    .HasForeignKey(d => d.UsuarioId)
                    .HasConstraintName("CAT_USR_USUARIOID_FK");
            });

            modelBuilder.Entity<Gasto>(entity =>
            {
                entity.HasKey(e => e.GastosId).HasName("GST_GastosID_PK");

                entity.Property(e => e.GastosId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("GastosID");
                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
                entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.Nombre).HasMaxLength(100);
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.HasOne(d => d.Categoria).WithMany(p => p.Gastos)
                    .HasForeignKey(d => d.CategoriaId)
                    .HasConstraintName("GST_CAT_CategoriaID_FK");

                entity.HasOne(d => d.Usuario).WithMany(p => p.Gastos)
                    .HasForeignKey(d => d.UsuarioId)
                    .HasConstraintName("GST_USR_UsuarioID_FK");
            });

            modelBuilder.Entity<Ingreso>(entity =>
            {
                entity.HasKey(e => e.IngresosId).HasName("ING_Ingresos_PK");

                entity.Property(e => e.IngresosId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("IngresosID");
                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
                entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.Nombre).HasMaxLength(100);
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.HasOne(d => d.Categoria).WithMany(p => p.Ingresos)
                    .HasForeignKey(d => d.CategoriaId)
                    .HasConstraintName("ING_CAT_CategoriaID_FK");

                entity.HasOne(d => d.Usuario).WithMany(p => p.Ingresos)
                    .HasForeignKey(d => d.UsuarioId)
                    .HasConstraintName("ING_USR_UsuarioID_FK");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.UsuarioId).HasName("USR_UsuarioID_PK");

                entity.HasIndex(e => e.Correo, "UQ__Usuarios__60695A19A3DBD5FB").IsUnique();

                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");
                entity.Property(e => e.Correo).HasMaxLength(100);
                entity.Property(e => e.Nombre).HasMaxLength(100);
                entity.Property(e => e.PasswordHash).HasMaxLength(255);
                entity.Property(e => e.Rol)
                    .HasMaxLength(10)
                    .HasDefaultValue("usuario");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        /// <summary>
        /// Método parcial para permitir la configuración adicional del modelo.
        /// </summary>
        /// <param name="modelBuilder">El objeto <see cref="ModelBuilder"/> utilizado para configurar el modelo.</param>
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
