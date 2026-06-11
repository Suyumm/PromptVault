using Microsoft.EntityFrameworkCore;
using PromptVault.Api.Models;

namespace PromptVault.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<PromptGroup> PromptGroups { get; set; }
        public DbSet<PromptVersion> PromptVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Bire-Çok ilişkiyi Fluent API ile netleştiriyoruz
            modelBuilder.Entity<PromptVersion>()
                .HasOne(pv => pv.Group)
                .WithMany(pg => pg.Versions)
                .HasForeignKey(pv => pv.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // Proje silinirse bağlı versiyonlar da silinsin

            // Maliyet alanı için SQL tarafında hassas ondalık tipini ayarlıyoruz
            modelBuilder.Entity<PromptVersion>()
                .Property(pv => pv.CostUsd)
                .HasColumnType("decimal(18,4)");
        }
    }
}