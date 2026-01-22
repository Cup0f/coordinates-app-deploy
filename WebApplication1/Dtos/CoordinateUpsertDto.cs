namespace WebApplication1.Dtos;

public class CoordinateUpsertDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Name { get; set; }
    public int Order { get; set; }
}