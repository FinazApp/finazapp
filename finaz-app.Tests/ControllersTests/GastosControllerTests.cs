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
    public class GastosControllerTests
    {
        private readonly Mock<FinanzAppContext> _mockContext;
        private readonly GastosController _controller;
        private readonly Mock<IMapper> _mockMapper;

        public GastosControllerTests()
        {
            _mockContext = new Mock<FinanzAppContext>();
            _mockMapper = new Mock<IMapper>();
            _controller = new GastosController(_mockContext.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task PostGasto_CreatesGasto()
        {
            // Arrange
            var nuevoGasto = new Gasto { GastosId = 1, Nombre = "Gasto Test", Monto = 100 };

            _mockContext.Setup(m => m.Gastos.Add(nuevoGasto));
            _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.PostGasto(nuevoGasto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdGasto = Assert.IsType<Gasto>(createdResult.Value);
            Assert.Equal("Gasto Test", createdGasto.Nombre);
        }

        [Fact]
        public async Task GetGasto_ReturnsGasto()
        {
            // Arrange
            var gasto = new Gasto { GastosId = 1, Nombre = "Gasto Test" };
            var gastoDTO = new GastosDTO { GastosId = 1, Nombre = "Gasto Test" };

            _mockContext.Setup(m => m.Gastos.FindAsync(1)).ReturnsAsync(gasto);
            _mockMapper.Setup(m => m.Map<GastosDTO>(gasto)).Returns(gastoDTO);

            // Act
            var result = await _controller.GetGasto(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<GastosDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult);

            var returnedGastoDTO = Assert.IsType<GastosDTO>(okResult.Value);
            Assert.Equal(1, returnedGastoDTO.GastosId);
            Assert.Equal("Gasto Test", returnedGastoDTO.Nombre);
        }

        [Fact]
        public async Task DeleteGasto_ReturnsNoContent()
        {
            // Arrange
            var gasto = new Gasto { GastosId = 1 };
            _mockContext.Setup(m => m.Gastos.FindAsync(1)).ReturnsAsync(gasto);

            // Act
            var result = await _controller.DeleteGasto(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}