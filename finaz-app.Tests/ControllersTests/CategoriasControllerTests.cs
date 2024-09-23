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
    public class CategoriasControllerTests
    {
        private readonly Mock<FinanzAppContext> _mockContext;
        private readonly CategoriasController _controller;
        private readonly Mock<IMapper> _mockMapper;

        public CategoriasControllerTests()
        {
            _mockContext = new Mock<FinanzAppContext>();
            _mockMapper = new Mock<IMapper>();
            _controller = new CategoriasController(_mockContext.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task PostCategoria_CreatesCategoria()
        {
            // Arrange
            var nuevaCategoria = new Categoria { CategoriaId = 1, Nombre = "Categoria Test" };

            _mockContext.Setup(m => m.Categorias.Add(It.IsAny<Categoria>()))
                .Callback<Categoria>(c => c.CategoriaId = nuevaCategoria.CategoriaId);
            _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.PostCategoria(nuevaCategoria);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdCategoria = Assert.IsType<Categoria>(createdResult.Value);
            Assert.Equal("Categoria Test", createdCategoria.Nombre);
        }

        [Fact]
        public async Task GetCategoria_ReturnsCategoria()
        {
            // Arrange
            var categoriaId = 1;
            var categoria = new Categoria { CategoriaId = categoriaId, Nombre = "Categoria Test" };
            var categoriaDTO = new CategoriasDTO { CategoriaId = categoriaId, Nombre = "Categoria Test" };

            _mockContext.Setup(m => m.Categorias.FindAsync(categoriaId)).ReturnsAsync(categoria);
            _mockMapper.Setup(m => m.Map<CategoriasDTO>(categoria)).Returns(categoriaDTO);

            // Act
            var result = await _controller.GetCategoria(categoriaId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<CategoriasDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);

            Assert.NotNull(okResult);

            var returnedCategoriaDTO = Assert.IsType<CategoriasDTO>(okResult.Value);

            Assert.Equal(categoriaId, returnedCategoriaDTO.CategoriaId);
            Assert.Equal("Categoria Test", returnedCategoriaDTO.Nombre);
        }

        [Fact]
        public async Task DeleteCategoria_ReturnsNoContent()
        {
            // Arrange
            var categoria = new Categoria { CategoriaId = 1 };
            _mockContext.Setup(m => m.Categorias.FindAsync(1)).ReturnsAsync(categoria);
            _mockContext.Setup(m => m.Categorias.Remove(categoria));
            _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.DeleteCategoria(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetCategoria_ReturnsNotFound_WhenCategoriaDoesNotExist()
        {
            // Arrange
            _mockContext.Setup(m => m.Categorias.FindAsync(1)).ReturnsAsync((Categoria)null);

            // Act
            var result = await _controller.GetCategoria(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<CategoriasDTO>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }
    }
}
