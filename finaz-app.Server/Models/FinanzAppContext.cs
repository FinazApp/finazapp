using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace finaz_app.Server.Models;

public partial class FinanzAppContext : DbContext
{
    public FinanzAppContext()
    {
    }

    public FinanzAppContext(DbContextOptions<FinanzAppContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Gasto> Gastos { get; set; }

    public virtual DbSet<Ingreso> Ingresos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer("Name=ConnectionStrings:AppConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.CategoriaId).HasName("CAT_CategoriaID_PK");

            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.Descripcion).HasMaxLength(100);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.FechaModificado).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.Nombre).HasMaxLength(100);

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.CategoriaCreadoPorNavigations)
                .HasForeignKey(d => d.CreadoPor)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CAT_USR_CreadoPor_FK");

            entity.HasOne(d => d.ModificadoPorNavigation).WithMany(p => p.CategoriaModificadoPorNavigations)
                .HasForeignKey(d => d.ModificadoPor)
                .HasConstraintName("CAT_USR_ModificadoPor_FK");
        });

        modelBuilder.Entity<Gasto>(entity =>
        {
            entity.HasKey(e => e.GastosId).HasName("GST_GastosID_PK");

            entity.Property(e => e.GastosId).HasColumnName("GastosID");
            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.FechaModificado).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Nombre).HasMaxLength(100);

            entity.HasOne(d => d.Categoria).WithMany(p => p.Gastos)
                .HasForeignKey(d => d.CategoriaId)
                .HasConstraintName("GST_CAT_CategoriaID_FK");

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.GastoCreadoPorNavigations)
                .HasForeignKey(d => d.CreadoPor)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("GST_USR_CreadoPor_FK");

            entity.HasOne(d => d.ModificadoPorNavigation).WithMany(p => p.GastoModificadoPorNavigations)
                .HasForeignKey(d => d.ModificadoPor)
                .HasConstraintName("GTS_USR_ModificadoPor_FK");
        });

        modelBuilder.Entity<Ingreso>(entity =>
        {
            entity.HasKey(e => e.IngresosId).HasName("ING_Ingresos_PK");

            entity.Property(e => e.IngresosId).HasColumnName("IngresosID");
            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.FechaModificado).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Nombre).HasMaxLength(100);

            entity.HasOne(d => d.Categoria).WithMany(p => p.Ingresos)
                .HasForeignKey(d => d.CategoriaId)
                .HasConstraintName("ING_CAT_CategoriaID_FK");

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.IngresoCreadoPorNavigations)
                .HasForeignKey(d => d.CreadoPor)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ING_USR_CreadoPor_FK");

            entity.HasOne(d => d.ModificadoPorNavigation).WithMany(p => p.IngresoModificadoPorNavigations)
                .HasForeignKey(d => d.ModificadoPor)
                .HasConstraintName("ING_USR_ModificadoPor_FK");
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

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
