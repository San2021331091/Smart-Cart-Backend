using DotNetEnv;
using asp_backend.Routes;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Controllers as services (NO attribute routing)
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseRouting();

// 🔥 Register route groups
app.MapOrderRoutes();

// Health check
app.MapGet("/", () => "Your server is running");

app.Run();
