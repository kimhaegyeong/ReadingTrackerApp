package com.booklog.controller;

import com.booklog.entity.Book;
import com.booklog.repository.BookRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/books")
@Tag(name = "Book Management", description = "APIs for managing books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    @Operation(
        summary = "List all books",
        description = "Returns a paginated list of all books",
        responses = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved books"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    public ResponseEntity<Page<Book>> getAllBooks(Pageable pageable) {
        return ResponseEntity.ok(bookRepository.findAll(pageable));
    }

    @GetMapping("/search")
    @Operation(
        summary = "Search books",
        description = "Search books by query string",
        responses = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved books"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters")
        }
    )
    public ResponseEntity<Page<Book>> searchBooks(
        @Parameter(description = "Search query") @RequestParam String query,
        Pageable pageable
    ) {
        return ResponseEntity.ok(bookRepository.searchBooks(query, pageable));
    }
}
