using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using finaz_app.Server.Controllers;
using finaz_app.Server.Models;
using finaz_app.Server.Models.DTOs;
using AutoMapper;
using System.Threading.Tasks;

namespace finaz_app.Tests
{
    public class IngresosControllerTests
    {
        private readonly Mock<FinanzAppContext> _mockContext;
        private readonly IngresosController _controller;
        private readonly Mock<IMapper> _mockMapper;

        public IngresosControllerTests()
        {
            _mockContext = new Mock<FinanzAppContext>();
            _mockMapper = new Mock<IMapper>();
            _controller = new IngresosController(_mockContext.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task PostIngreso_CreatesIngreso()
        {
            // Arrange
            var nuevoIngreso = new Ingreso { IngresosId = 1, Nombre = "Ingreso Test", Monto = 100 };

            _mockContext.Setup(m => m.Ingresos.Add(nuevoIngreso));
            _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.PostIngreso(nuevoIngreso);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("Ingreso Test", ((Ingreso)createdResult.Value).Nombre);
        }

        [Fact]
        public async Task GetIngreso_ReturnsIngreso()
        {
            // Arrange
            var ingreso = new Ingreso { IngresosId = 1, Nombre = "Ingreso Test" };
            var ingresoDTO = new IngresosDTO { IngresosId = 1, Nombre = "Ingreso Test" };

            _mockContext.Setup(m => m.Ingresos.FindAsync(1)).ReturnsAsync(ingreso);
            _mockMapper.Setup(m => m.Map<IngresosDTO>(ingreso)).Returns(ingresoDTO);

            // Act
            var result = await _controller.GetIngreso(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IngresosDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult);

            var returnedIngresoDTO = Assert.IsType<IngresosDTO>(okResult.Value);
            Assert.Equal(1, returnedIngresoDTO.IngresosId);
            Assert.Equal("Ingreso Test", returnedIngresoDTO.Nombre);
        }

        [Fact]
        public async Task DeleteIngreso_ReturnsNoContent()
        {
            // Arrange
            var ingreso = new Ingreso { IngresosId = 1 };
            _mockContext.Setup(m => m.Ingresos.FindAsync(1)).ReturnsAsync(ingreso);

            // Act
            var result = await _controller.DeleteIngreso(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
