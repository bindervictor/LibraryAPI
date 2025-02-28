using LibraryAPI.Data;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BooksController(LibraryContext context)
        {
            _context = context;
        }

        // Validações auxiliares 

        private string? ValidateYear(int year)
        {
            if (year > DateTime.UtcNow.Year)
            {
                return "O ano do livro não pode ser maior que o ano atual.";
            }
            return null;
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }

        private string? ValidateMaxCategories(List<int> categoryIds)
        {
            if (categoryIds.Count > 3)
            {
                return "Você pode associar no máximo 3 categorias.";
            }
            return null;
        }

        private async Task<string?> ValidateCategoriesExist(List<int> categoryIds)
        {
            var existingCategories = await _context.Categories
                .Where(c => categoryIds.Contains(c.Id))
                .Select(c => c.Id)
                .ToListAsync();

            if (existingCategories.Count != categoryIds.Count)
            {
                return "Uma ou mais categorias não existem.";
            }
            return null;
        }

        // Rotas da API 

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks()
        {
            var books = await _context.Books
                .Include(b => b.BookCategories)
                    .ThenInclude(bc => bc.Category)
                .Select(b => new BookDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    Year = b.Year,
                    Categories = b.BookCategories
                        .Where(bc => bc.Category != null)
                        .Select(bc => new CategoryDTO
                        {
                            Id = bc.Category!.Id,
                            Name = bc.Category.Name
                        }).ToList()
                })
                .ToListAsync();

            return Ok(books);
        }

        // GET: api/Books/Id
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.BookCategories)
                    .ThenInclude(bc => bc.Category)
                .Where(b => b.Id == id)
                .Select(b => new BookDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    Year = b.Year,
                    Categories = b.BookCategories
                        .Where(bc => bc.Category != null)
                        .Select(bc => new CategoryDTO
                        {
                            Id = bc.Category!.Id,
                            Name = bc.Category.Name
                        }).ToList()
                })
                .FirstOrDefaultAsync();

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // POST: api/Books
        [HttpPost]
        public async Task<ActionResult<BookDTO>> PostBook([FromBody] BookCreateDTO bookDto)
        {
            var validationError = ValidateYear(bookDto.Year) ?? 
                                  ValidateMaxCategories(bookDto.CategoryIds) ??
                                  await ValidateCategoriesExist(bookDto.CategoryIds);
            if (validationError != null)
            {
                return BadRequest(validationError);
            }

            var categories = await _context.Categories
                .Where(c => bookDto.CategoryIds.Contains(c.Id))
                .ToListAsync();

            var newBook = new Book
            {
                Name = bookDto.Name,
                Year = bookDto.Year,
                BookCategories = categories.Select(category => new BookCategory
                {
                    CategoryId = category.Id
                }).ToList()
            };

            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = newBook.Id }, newBook);
        }

        // PUT: api/Books/Id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, [FromBody] BookUpdateDTO bookDto)
        {
            var existingBook = await _context.Books
                .Include(b => b.BookCategories)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (existingBook == null)
            {
                return NotFound();
            }

            var validationError = ValidateYear(bookDto.Year) ??
                                  ValidateMaxCategories(bookDto.CategoryIds) ??
                                  await ValidateCategoriesExist(bookDto.CategoryIds);
            if (validationError != null)
            {
                return BadRequest(validationError);
            }

            var categories = await _context.Categories
                .Where(c => bookDto.CategoryIds.Contains(c.Id))
                .ToListAsync();

            // Atualiza os dados do livro
            existingBook.Name = bookDto.Name;
            existingBook.Year = bookDto.Year;
            existingBook.BookCategories.Clear(); // Remove categorias antigas

            // Associa as novas categorias
            existingBook.BookCategories = categories.Select(category => new BookCategory
            {
                BookId = existingBook.Id,
                CategoryId = category.Id
            }).ToList();

            _context.Entry(existingBook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Books/Id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("O ID do livro fornecido não foi encontrado.");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
