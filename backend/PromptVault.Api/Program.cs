using Microsoft.EntityFrameworkCore;
using PromptVault.Api.Data;
using System.Text.Json.Serialization; // Gerekli kütüphane en tepede!

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Ayarı
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// 2. Sonsuz Döngü (Object Cycle) Çözümü ve Controller'lar
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// 3. Veritabanı (SQLite) Bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// CORS'u aktif et
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();