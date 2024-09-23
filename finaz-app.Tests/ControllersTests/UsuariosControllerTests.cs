using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using finaz_app.Server.Controllers;
using finaz_app.Server.Models;
using finaz_app.Server.Models.DTOs;
using AutoMapper;
using System.Threading.Tasks;

namespace finaz_app.Tests.ControllersTests
{
    public class UsuariosControllerTests
    {
        private readonly Mock<FinanzAppContext> _mockContext;
        private readonly UsuariosController _controller;
        private readonly Mock<IMapper> _mockMapper;

        public UsuariosControllerTests()
        {
            _mockContext = new Mock<FinanzAppContext>();
            _mockMapper = new Mock<IMapper>();
            _controller = new UsuariosController(_mockContext.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task PostUsuario_CreatesUsuario()
        {
            // Arrange
            var nuevoUsuario = new Usuario { UsuarioId = 1, Nombre = "Usuario Test" };

            _mockContext.Setup(m => m.Usuarios.Add(nuevoUsuario));
            _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.PostUsuario(nuevoUsuario);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdUsuario = Assert.IsType<Usuario>(createdResult.Value);
            Assert.Equal("Usuario Test", createdUsuario.Nombre);
        }

        [Fact]
        public async Task GetUsuario_ReturnsUsuario()
        {
            // Arrange
            var usuario = new Usuario { UsuarioId = 1, Nombre = "Usuario Test" };
            var usuarioDTO = new UsuariosDTO { UsuarioId = 1, Nombre = "Usuario Test" };

            _mockContext.Setup(m => m.Usuarios.FindAsync(1)).ReturnsAsync(usuario);
            _mockMapper.Setup(m => m.Map<UsuariosDTO>(usuario)).Returns(usuarioDTO);

            // Act
            var result = await _controller.GetUsuario(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<UsuariosDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult);

            var returnedUsuarioDTO = Assert.IsType<UsuariosDTO>(okResult.Value);
            Assert.Equal(1, returnedUsuarioDTO.UsuarioId);
            Assert.Equal("Usuario Test", returnedUsuarioDTO.Nombre);
        }

        [Fact]
        public async Task DeleteUsuario_ReturnsNoContent()
        {
            // Arrange
            var usuario = new Usuario { UsuarioId = 1 };
            _mockContext.Setup(m => m.Usuarios.FindAsync(1)).ReturnsAsync(usuario);

            // Act
            var result = await _controller.DeleteUsuario(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
