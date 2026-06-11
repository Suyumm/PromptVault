using System;

namespace PromptVault.Api.Models
{
    public class PromptVersion
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid GroupId { get; set; } // Foreign Key
        public string Content { get; set; } = string.Empty;
        public string ModelUsed { get; set; } = string.Empty;
        public int TokenUsage { get; set; }
        public int LatencyMs { get; set; }
        public decimal CostUsd { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public PromptGroup? Group { get; set; }
    }
}