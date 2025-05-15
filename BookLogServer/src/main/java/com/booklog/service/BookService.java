package com.booklog.service;

import com.booklog.entity.Book;
import com.booklog.exception.ResourceNotFoundException;
import com.booklog.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
    }

    public Book getBookByIsbn(String isbn) {
        // Try to find by ISBN13 first
        return bookRepository.findByIsbn13(isbn)
                .orElseGet(() -> bookRepository.findByIsbn10(isbn)
                        .orElseThrow(() -> new ResourceNotFoundException("Book", "isbn", isbn)));
    }

    public Page<Book> searchBooks(String query, Pageable pageable) {
        return bookRepository.searchBooks(query, pageable);
    }

    public Page<Book> findBooksByFilters(String title, String author, String publisher, 
                                         String category, String language, Pageable pageable) {
        return bookRepository.findByFilters(title, author, publisher, category, language, pageable);
    }

    public List<Book> getPopularBooks() {
        return bookRepository.findTop10ByOrderByAverageRatingDesc();
    }

    @Transactional
    public Book createBook(Book book) {
        // Check if book with the same ISBN already exists
        if (book.getIsbn13() != null && bookRepository.findByIsbn13(book.getIsbn13()).isPresent()) {
            throw new IllegalArgumentException("Book with ISBN13 " + book.getIsbn13() + " already exists");
        }
        
        if (book.getIsbn10() != null && bookRepository.findByIsbn10(book.getIsbn10()).isPresent()) {
            throw new IllegalArgumentException("Book with ISBN10 " + book.getIsbn10() + " already exists");
        }
        
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);
        
        // Update fields
        if (bookDetails.getTitle() != null) {
            book.setTitle(bookDetails.getTitle());
        }
        
        if (bookDetails.getSubtitle() != null) {
            book.setSubtitle(bookDetails.getSubtitle());
        }
        
        if (bookDetails.getAuthors() != null && !bookDetails.getAuthors().isEmpty()) {
            book.setAuthors(bookDetails.getAuthors());
        }
        
        if (bookDetails.getPublisher() != null) {
            book.setPublisher(bookDetails.getPublisher());
        }
        
        if (bookDetails.getPublishedDate() != null) {
            book.setPublishedDate(bookDetails.getPublishedDate());
        }
        
        if (bookDetails.getDescription() != null) {
            book.setDescription(bookDetails.getDescription());
        }
        
        if (bookDetails.getPageCount() != null) {
            book.setPageCount(bookDetails.getPageCount());
        }
        
        if (bookDetails.getCategories() != null && !bookDetails.getCategories().isEmpty()) {
            book.setCategories(bookDetails.getCategories());
        }
        
        if (bookDetails.getThumbnail() != null) {
            book.setThumbnail(bookDetails.getThumbnail());
        }
        
        if (bookDetails.getLanguage() != null) {
            book.setLanguage(bookDetails.getLanguage());
        }
        
        if (bookDetails.getIsbn10() != null) {
            book.setIsbn10(bookDetails.getIsbn10());
        }
        
        if (bookDetails.getIsbn13() != null) {
            book.setIsbn13(bookDetails.getIsbn13());
        }
        
        if (bookDetails.getAverageRating() != null) {
            book.setAverageRating(bookDetails.getAverageRating());
        }
        
        if (bookDetails.getRatingsCount() != null) {
            book.setRatingsCount(bookDetails.getRatingsCount());
        }
        
        if (bookDetails.getPreviewLink() != null) {
            book.setPreviewLink(bookDetails.getPreviewLink());
        }
        
        if (bookDetails.getInfoLink() != null) {
            book.setInfoLink(bookDetails.getInfoLink());
        }
        
        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        bookRepository.delete(book);
    }
}
