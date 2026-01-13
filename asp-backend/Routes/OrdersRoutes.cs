using asp_backend.Controllers;
using asp_backend.Data;

namespace asp_backend.Routes;

public static class OrdersRoutes
{
    public static void MapOrderRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/orders");
        var controller = new OrdersController();

        // GET /orders
        group.MapGet("/", async () =>
        {
            return Results.Ok("Server is running now");
        });

        // GET /orders/{userUid}
        group.MapGet("/{userUid}", async (string userUid) =>
        {
            return Results.Ok(await controller.GetByUser(userUid));
        });

        // GET /orders/test-db
        group.MapGet("/test-db", async () =>
        {
            await using var conn = Db.GetConnection();
            await conn.OpenAsync();
            return Results.Ok("Database connected successfully");
        });
    }
}
