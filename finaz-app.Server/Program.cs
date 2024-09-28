using finaz_app.Server.Models.DTOs;
using finaz_app.Server.Security.DB;
using finaz_app.Server.Security.JWT;
using finaz_app.Server.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Añadir configuraciones
builder.Services.AddSwaggerConfiguration();
builder.Services.AddDbConfiguration(builder.Configuration);
builder.Services.AddCorsConfiguration();
builder.Services.AddScoped<JwtServices>();

// Configurar la autenticación JWT
var key = builder.Configuration["AppSettings:Token"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// añadir autoMapper
builder.Services.AddAutoMapper(typeof(MapeoPerfiles));

builder.Services.AddControllers();

// Configuración adicional de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUIConfiguration();
}

app.UseHttpsRedirection();
app.UseCorsConfiguration();
app.UseCookiesConfiguration();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();