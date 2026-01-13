using asp_backend.Data;
using asp_backend.Models;
using Npgsql;

namespace asp_backend.Controllers;

public class OrdersController
{
    public async Task<List<Order>> GetAll()
    {
        var orders = new List<Order>();

        await using var conn = Db.GetConnection();
        await conn.OpenAsync();

        const string query = """
            SELECT id, user_uid, product_id, img_url, quantity, price, ordered_at, status
            FROM orders;
        """;

        await using var cmd = new NpgsqlCommand(query, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            orders.Add(new Order
            {
                Id = reader.GetInt32(0),
                UserUid = reader.GetString(1),
                ProductId = reader.GetInt32(2),
                ImgUrl = reader.GetString(3),
                Quantity = reader.GetInt32(4),
                Price = reader.GetDecimal(5),
                OrderedAt = reader.GetFieldValue<DateTimeOffset>(6),
                Status = reader.IsDBNull(7) ? "pending" : reader.GetString(7)
            });
        }

        return orders;
    }

    public async Task<List<Order>> GetByUser(string userUid)
    {
        var orders = new List<Order>();

        await using var conn = Db.GetConnection();
        await conn.OpenAsync();

        const string query = """
            SELECT id, user_uid, product_id, img_url, quantity, price, ordered_at, status
            FROM orders
            WHERE user_uid = @userUid;
        """;

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("userUid", userUid);

        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            orders.Add(new Order
            {
                Id = reader.GetInt32(0),
                UserUid = reader.GetString(1),
                ProductId = reader.GetInt32(2),
                ImgUrl = reader.GetString(3),
                Quantity = reader.GetInt32(4),
                Price = reader.GetDecimal(5),
                OrderedAt = reader.GetFieldValue<DateTimeOffset>(6),
                Status = reader.IsDBNull(7) ? "pending" : reader.GetString(7)
            });
        }

        return orders;
    }
}
