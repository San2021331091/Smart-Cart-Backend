namespace asp_backend.Models;

public class Order
{
    public int Id { get; set; }
    public string UserUid { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string ImgUrl { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTimeOffset OrderedAt { get; set; }
    public string Status { get; set; } = "pending";
}
