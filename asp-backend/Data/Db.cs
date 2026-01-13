using Npgsql;
namespace asp_backend.Data;

public static class Db
{
    public static NpgsqlConnection GetConnection()
    {
        var cs =
            $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
            $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
            $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
            $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
            $"Password={Environment.GetEnvironmentVariable("DB_PASS")};" +
            $"SslMode={Environment.GetEnvironmentVariable("DB_SSLMODE")};" +
            $"Trust Server Certificate=true;";

        return new NpgsqlConnection(cs);
    }
}
