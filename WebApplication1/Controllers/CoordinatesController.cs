using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CoordinatesController : ControllerBase
{ 
    private readonly AppDbContext _context;
    
    public CoordinatesController(AppDbContext context)
    {
        _context = context;
    }
   
   [HttpGet]
   public async Task<ActionResult<IEnumerable<Coordinate>>> GetAll()
   {
       var coords = await _context.Coordinates
           .OrderBy(c => c.Id)
           .ToListAsync();

       return Ok(coords);
   }

   [HttpGet("{id:int}")]
   public async Task<ActionResult<Coordinate>> GetById(int id)
   {
       var coord = await _context.Coordinates.FindAsync(id);
       if (coord == null) return NotFound();
       return Ok(coord);
   }
}