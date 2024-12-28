using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace finaz_app.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFotoPerfilToUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<string>(
                name: "FotoPerfil",
                table: "Usuarios",
                nullable: true);
                
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CorreoElectronico = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FotoPerfil = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "usuario")
                },
                constraints: table =>
                {
                    table.PrimaryKey("USR_UsuarioID_PK", x => x.UsuarioID);
                });

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    CategoriaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    isSystem = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreadoPor = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(CONVERT([date],getdate()))"),
                    ModificadoPor = table.Column<int>(type: "int", nullable: true),
                    FechaModificado = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(CONVERT([date],getdate()))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("CAT_CategoriaID_PK", x => x.CategoriaID);
                    table.ForeignKey(
                        name: "CAT_USR_CreadoPor_FK",
                        column: x => x.CreadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "CAT_USR_ModificadoPor_FK",
                        column: x => x.ModificadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID");
                });

            migrationBuilder.CreateTable(
                name: "MetasAhorro",
                columns: table => new
                {
                    MetaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MontoObjetivo = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MontoAhorrado = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    FechaMeta = table.Column<DateTime>(type: "date", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreadoPor = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(GETDATE())"),
                    ModificadoPor = table.Column<int>(type: "int", nullable: true),
                    FechaModificado = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(GETDATE())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("MA_MetaId_PK", x => x.MetaId);
                    table.CheckConstraint("CHK_MontoAhorrado", "[MontoAhorrado] <= [MontoObjetivo]");
                    table.ForeignKey(
                        name: "MA_USR_CreadoPor_FK",
                        column: x => x.CreadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "MA_USR_ModificadoPor_FK",
                        column: x => x.ModificadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID");
                });

            migrationBuilder.CreateTable(
                name: "Gastos",
                columns: table => new
                {
                    GastoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoriaID = table.Column<int>(type: "int", nullable: true),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreadoPor = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(CONVERT([date],getdate()))"),
                    ModificadoPor = table.Column<int>(type: "int", nullable: true),
                    FechaModificado = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(CONVERT([date],getdate()))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("GST_GastoID_PK", x => x.GastoID);
                    table.ForeignKey(
                        name: "GST_CAT_CategoriaID_FK",
                        column: x => x.CategoriaID,
                        principalTable: "Categorias",
                        principalColumn: "CategoriaID");
                    table.ForeignKey(
                        name: "GST_USR_CreadoPor_FK",
                        column: x => x.CreadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "GTS_USR_ModificadoPor_FK",
                        column: x => x.ModificadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID");
                });

            migrationBuilder.CreateTable(
                name: "Ingresos",
                columns: table => new
                {
                    IngresoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoriaID = table.Column<int>(type: "int", nullable: true),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreadoPor = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(CONVERT([date],getdate()))"),
                    ModificadoPor = table.Column<int>(type: "int", nullable: true),
                    FechaModificado = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(CONVERT([date],getdate()))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("ING_IngresoID_PK", x => x.IngresoID);
                    table.ForeignKey(
                        name: "ING_CAT_CategoriaID_FK",
                        column: x => x.CategoriaID,
                        principalTable: "Categorias",
                        principalColumn: "CategoriaID");
                    table.ForeignKey(
                        name: "ING_USR_CreadoPor_FK",
                        column: x => x.CreadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "ING_USR_ModificadoPor_FK",
                        column: x => x.ModificadoPor,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_CreadoPor",
                table: "Categorias",
                column: "CreadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_ModificadoPor",
                table: "Categorias",
                column: "ModificadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_CategoriaID",
                table: "Gastos",
                column: "CategoriaID");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_CreadoPor",
                table: "Gastos",
                column: "CreadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_ModificadoPor",
                table: "Gastos",
                column: "ModificadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Ingresos_CategoriaID",
                table: "Ingresos",
                column: "CategoriaID");

            migrationBuilder.CreateIndex(
                name: "IX_Ingresos_CreadoPor",
                table: "Ingresos",
                column: "CreadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Ingresos_ModificadoPor",
                table: "Ingresos",
                column: "ModificadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_MetasAhorro_CreadoPor",
                table: "MetasAhorro",
                column: "CreadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_MetasAhorro_ModificadoPor",
                table: "MetasAhorro",
                column: "ModificadoPor");

            migrationBuilder.CreateIndex(
                name: "UQ__Usuarios__60695A19A3DBD5FB",
                table: "Usuarios",
                column: "CorreoElectronico",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Gastos");

            migrationBuilder.DropTable(
                name: "Ingresos");

            migrationBuilder.DropTable(
                name: "MetasAhorro");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropTable(
                name: "Usuarios");
            
            migrationBuilder.DropColumn(
                name: "FotoPerfil",
                table: "Usuarios");
        }
    }
}
