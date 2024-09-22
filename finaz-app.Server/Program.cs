using finaz_app.Server.Models;
using finaz_app.Server.Models.DTOs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Inyección Cadena de Conexión

var connectionString = builder.Configuration.GetConnectionString("AppConnection");

builder.Services.AddDbContext<FinanzAppContext>(op => op.UseSqlServer(connectionString));

// añadir autoMapper

builder.Services.AddAutoMapper(typeof(MapeoPerfiles));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(ops =>
{
    ops.AllowAnyHeader();
    ops.AllowAnyMethod();
    ops.AllowAnyOrigin();
});

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
