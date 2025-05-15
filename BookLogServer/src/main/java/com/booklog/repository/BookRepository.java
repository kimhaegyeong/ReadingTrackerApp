package com.booklog.repository;

import com.booklog.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    Optional<Book> findByIsbn13(String isbn13);
    
    Optional<Book> findByIsbn10(String isbn10);
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.subtitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "EXISTS (SELECT 1 FROM b.authors a WHERE LOWER(a) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> searchBooks(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR EXISTS (SELECT 1 FROM b.authors a WHERE LOWER(a) LIKE LOWER(CONCAT('%', :author, '%')))) AND " +
           "(:publisher IS NULL OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :publisher, '%'))) AND " +
           "(:category IS NULL OR EXISTS (SELECT 1 FROM b.categories c WHERE LOWER(c) LIKE LOWER(CONCAT('%', :category, '%')))) AND " +
           "(:language IS NULL OR LOWER(b.language) = LOWER(:language))")
    Page<Book> findByFilters(
            @Param("title") String title,
            @Param("author") String author,
            @Param("publisher") String publisher,
            @Param("category") String category,
            @Param("language") String language,
            Pageable pageable);
    
    List<Book> findTop10ByOrderByAverageRatingDesc();
}
