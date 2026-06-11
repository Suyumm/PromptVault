using System;
using System.Collections.Generic;

namespace PromptVault.Api.Models
{
    public class PromptGroup
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string ProjectName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Bire-çok ilişki (Bir grubun birden fazla versiyonu olur)
        public ICollection<PromptVersion> Versions { get; set; } = new List<PromptVersion>();
    }
}