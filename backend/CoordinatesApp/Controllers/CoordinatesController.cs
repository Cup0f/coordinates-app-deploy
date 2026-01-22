using CoordinatesApp.Data;
using CoordinatesApp.Dtos;
using CoordinatesApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoordinatesApp.Controllers;

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

   [HttpPost]
   public async Task<ActionResult<Coordinate>> Create(CoordinateUpsertDto dto)
   {
       var entity = new Coordinate
       {
           Latitude = dto.Latitude,
           Longitude = dto.Longitude,
           Name = dto.Name,
           Order = dto.Order,
       };

       _context.Coordinates.Add(entity);
       await _context.SaveChangesAsync();
       
       return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
   }

   [HttpPut("{id:int}")]
   public async Task<IActionResult> Update(int id, CoordinateUpsertDto dto)
   {
       var entity = await _context.Coordinates.FindAsync(id);
       if (entity == null) return NotFound();
       
       entity.Latitude = dto.Latitude;
       entity.Longitude = dto.Longitude;
       entity.Name = dto.Name;
       entity.Order = dto.Order;
       
       await _context.SaveChangesAsync();
       
       return NoContent();
   }

   [HttpDelete("{id:int}")]
   public async Task<ActionResult<Coordinate>> Delete(int id)
   {
       var entity = await _context.Coordinates.FindAsync(id);
       if (entity == null) return NotFound();

       _context.Coordinates.Remove(entity);
       await _context.SaveChangesAsync();

       return NoContent();
   }
}