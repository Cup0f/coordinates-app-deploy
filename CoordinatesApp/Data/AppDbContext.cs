using CoordinatesApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CoordinatesApp.Data;

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