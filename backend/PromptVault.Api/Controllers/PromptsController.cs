using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptVault.Api.Data;
using PromptVault.Api.Models;

namespace PromptVault.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromptsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromptsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/prompts
        // Veritabanındaki tüm prompt gruplarını ve altındaki versiyonları (A/B testlerini) getirir.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromptGroup>>> GetPrompts()
        {
            return await _context.PromptGroups
                .Include(g => g.Versions) // İlişkili versiyonları da SQL'den Join ile çekiyoruz
                .ToListAsync();
        }

        // POST: api/prompts
        // Yeni bir prompt grubu ve ilk versiyonunu sisteme kaydeder.
        [HttpPost]
        public async Task<ActionResult<PromptGroup>> CreatePromptGroup(PromptGroup newGroup)
        {
            _context.PromptGroups.Add(newGroup);
            await _context.SaveChangesAsync();

            return Ok(newGroup);
        }

        // POST: api/prompts/{id}/versions
        // Var olan bir projeye yeni bir A/B testi (Versiyon 2, Versiyon 3 vs.) ekler.
        [HttpPost("{groupId}/versions")]
        public async Task<ActionResult<PromptVersion>> AddVersion(Guid groupId, PromptVersion newVersion)
        {
            var group = await _context.PromptGroups.FindAsync(groupId);
            if (group == null) return NotFound("Proje bulunamadı.");

            newVersion.GroupId = groupId;
            _context.PromptVersions.Add(newVersion);
            await _context.SaveChangesAsync();

            return Ok(newVersion);
        }

        [HttpPost("{groupId}/duel")]
        public async Task<ActionResult<IEnumerable<PromptVersion>>> AddDuelVersions(Guid groupId, [FromBody] List<PromptVersion> duelVersions)
        {
            var group = await _context.PromptGroups.FindAsync(groupId);
            if (group == null) return NotFound("Proje bulunamadı.");

            // Gelen listedeki tüm versiyonları veritabanına ekle
            foreach (var version in duelVersions)
            {
                version.GroupId = groupId;
                _context.PromptVersions.Add(version);
            }

        // Hepsini tek bir seferde (atomik olarak) kaydet
        await _context.SaveChangesAsync();

        return Ok(duelVersions);
        }

        
    }
}