using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Name { get; set; }

        public List<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    }
}

