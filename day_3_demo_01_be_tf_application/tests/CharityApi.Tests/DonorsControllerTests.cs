namespace CharityApi.Tests;

using CharityApi.Controllers;
using CharityApi.Models;
using CharityApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

public class DonorsControllerTests
{
    private readonly Mock<IDonorService> _service = new();
    private readonly DonorsController _controller;

    public DonorsControllerTests()
    {
        _controller = new DonorsController(_service.Object);
    }

    [Fact]
    public void GetById_ExistingDonor_ReturnsOk()
    {
        var donor = new Donor { Id = 1, Name = "Alice Smith" };
        _service.Setup(s => s.GetById(1)).Returns(donor);

        var result = _controller.GetById(1);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void Create_ValidRequest_ReturnsOk()
    {
        var request = new CreateDonorRequest("Alice Smith", "alice@example.com", "A+");
        var donor = new Donor { Id = 1, Name = "Alice Smith" };
        _service.Setup(s => s.Create(request)).Returns(donor);

        var result = _controller.Create(request);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void Create_ShortName_ReturnsBadRequest()
    {
        var result = _controller.Create(new CreateDonorRequest("X", "x@example.com", "A+"));

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void Create_InvalidEmail_ReturnsBadRequest()
    {
        var result = _controller.Create(new CreateDonorRequest("Alice Smith", "not-an-email", "A+"));

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void Update_ExistingDonor_ReturnsOk()
    {
        var request = new UpdateDonorRequest("Alice Updated", "alice@example.com", "A+");
        var donor = new Donor { Id = 1, Name = "Alice Updated" };
        _service.Setup(s => s.Update(1, request)).Returns(donor);

        var result = _controller.Update(1, request);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void Update_NonExistentDonor_ReturnsNotFound()
    {
        _service.Setup(s => s.Update(99, It.IsAny<UpdateDonorRequest>())).Returns((Donor?)null);

        var result = _controller.Update(99, new UpdateDonorRequest("X", "x@example.com", "O+"));

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Delete_ExistingDonor_ReturnsOk()
    {
        _service.Setup(s => s.Delete(1)).Returns(true);

        var result = _controller.Delete(1);

        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public void Delete_NonExistentDonor_ReturnsNotFound()
    {
        _service.Setup(s => s.Delete(99)).Returns(false);

        var result = _controller.Delete(99);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void GetAll_InvalidPage_ReturnsBadRequest()
    {
        var result = _controller.GetAll(page: 0);

        Assert.IsType<BadRequestObjectResult>(result);
    }
}
