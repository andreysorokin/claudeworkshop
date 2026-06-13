namespace CharityApi.Controllers;

using CharityApi.Models;
using CharityApi.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DonorsController : ControllerBase
{
    private readonly IDonorService _service;

    public DonorsController(IDonorService service) => _service = service;

    [HttpGet]
    public IActionResult GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1 || pageSize > 100)
        {
            return BadRequest("Invalid pagination parameters.");
        }

        return Ok(_service.GetPaged(page, pageSize));
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var donor = _service.GetById(id);
        // ISSUE: returns 200 with a null body when donor does not exist
        return Ok(donor);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateDonorRequest request)
    {
        // ISSUE: manual validation — should be handled by FluentValidation
        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Length < 2)
        {
            return BadRequest("Name must be at least 2 characters.");
        }

        if (!request.Email.Contains('@'))
        {
            return BadRequest("Email is invalid.");
        }

        var donor = _service.Create(request);
        // ISSUE: should return 201 Created with a Location header
        return Ok(donor);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UpdateDonorRequest request)
    {
        var donor = _service.Update(id, request);
        if (donor is null)
        {
            return NotFound();
        }

        return Ok(donor);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _service.Delete(id);
        if (!deleted)
        {
            return NotFound();
        }

        // ISSUE: should return 204 NoContent
        return Ok();
    }
}
