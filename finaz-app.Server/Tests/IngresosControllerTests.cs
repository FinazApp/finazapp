using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using finaz_app.Server.Controllers;
using finaz_app.Server.Models;
using AutoMapper;

public class IngresosControllerTests
{
    private readonly Mock<FinanzAppContext> _mockContext;
    private readonly Mock<IMapper> _mockMapper;
    private readonly IngresosController _controller;

    public IngresosControllerTests()
    {
        _mockContext = new Mock<FinanzAppContext>();

        _mockMapper = new Mock<IMapper>();

        _controller = new IngresosController(_mockContext.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task PostIngreso_CreatesNewIngreso_ReturnsCreatedAtActionResult()
    {
        //Arrange
        var nuevoIngreso = new Ingreso
        {
            Nombre = "Salario",
            Monto = 1000
        };

        //Act
        var result = await _controller.PostIngreso(nuevoIngreso);

        // Assert
        var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.NotNull(actionResult);
        Assert.Equal("GetIngreso", actionResult.ActionName);
    }
}
