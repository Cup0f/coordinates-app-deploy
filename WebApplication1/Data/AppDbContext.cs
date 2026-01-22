using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Coordinate> Coordinates => Set<Coordinate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Coordinate>().ToTable("coordinates");

        modelBuilder.Entity<Coordinate>()
            .Property(c => c.Order)
            .HasColumnName("order");
    }
}