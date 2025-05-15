package com.booklog.controller;

import com.booklog.entity.LibraryBook;
import com.booklog.entity.LibraryBook.BookStatus;
import com.booklog.security.CurrentUser;
import com.booklog.security.UserPrincipal;
import com.booklog.service.LibraryBookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/library")
public class LibraryController {

    private final LibraryBookService libraryBookService;

    public LibraryController(LibraryBookService libraryBookService) {
        this.libraryBookService = libraryBookService;
    }

    @GetMapping
    public ResponseEntity<Page<LibraryBook>> getUserLibrary(
            @CurrentUser UserPrincipal currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<LibraryBook> books = libraryBookService.getUserLibrary(currentUser.getId(), pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<LibraryBook>> getUserLibraryByStatus(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable BookStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<LibraryBook> books = libraryBookService.getUserLibraryByStatus(currentUser.getId(), status, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/tag")
    public ResponseEntity<Page<LibraryBook>> getUserLibraryByTag(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(required = false) BookStatus status,
            @RequestParam String tag,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<LibraryBook> books = libraryBookService.getUserLibraryByStatusAndTag(
                currentUser.getId(), status, tag, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/{bookId}")
    public ResponseEntity<LibraryBook> getUserLibraryBook(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId) {
        
        LibraryBook book = libraryBookService.getUserLibraryBook(currentUser.getId(), bookId);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/books/{bookId}/exists")
    public ResponseEntity<Map<String, Boolean>> checkBookInLibrary(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId) {
        
        boolean exists = libraryBookService.isBookInUserLibrary(currentUser.getId(), bookId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @PostMapping("/books/{bookId}")
    public ResponseEntity<LibraryBook> addBookToLibrary(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId,
            @RequestParam BookStatus status) {
        
        LibraryBook book = libraryBookService.addBookToLibrary(currentUser.getId(), bookId, status);
        return ResponseEntity.ok(book);
    }

    @PutMapping("/books/{bookId}/status")
    public ResponseEntity<LibraryBook> updateBookStatus(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody UpdateStatusRequest updateStatusRequest) {
        
        LibraryBook book = libraryBookService.updateBookStatus(
                currentUser.getId(), 
                bookId, 
                updateStatusRequest.getStatus(),
                updateStatusRequest.getProgress());
        
        return ResponseEntity.ok(book);
    }

    @PutMapping("/books/{bookId}/progress")
    public ResponseEntity<LibraryBook> updateBookProgress(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody UpdateProgressRequest updateProgressRequest) {
        
        LibraryBook book = libraryBookService.updateBookProgress(
                currentUser.getId(), 
                bookId, 
                updateProgressRequest.getProgress());
        
        return ResponseEntity.ok(book);
    }

    @PutMapping("/books/{bookId}/rating")
    public ResponseEntity<LibraryBook> updateBookRating(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody UpdateRatingRequest updateRatingRequest) {
        
        LibraryBook book = libraryBookService.updateBookRating(
                currentUser.getId(), 
                bookId, 
                updateRatingRequest.getRating(),
                updateRatingRequest.getReview());
        
        return ResponseEntity.ok(book);
    }

    @PutMapping("/books/{bookId}/tags")
    public ResponseEntity<LibraryBook> updateBookTags(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody UpdateTagsRequest updateTagsRequest) {
        
        LibraryBook book = libraryBookService.updateBookTags(
                currentUser.getId(), 
                bookId, 
                updateTagsRequest.getTags());
        
        return ResponseEntity.ok(book);
    }

    @PutMapping("/books/{bookId}/favorite")
    public ResponseEntity<LibraryBook> toggleFavorite(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId) {
        
        LibraryBook book = libraryBookService.toggleFavorite(currentUser.getId(), bookId);
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/books/{bookId}")
    public ResponseEntity<?> removeBookFromLibrary(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long bookId) {
        
        libraryBookService.removeBookFromLibrary(currentUser.getId(), bookId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<BookStatus, Long>> getLibraryStats(
            @CurrentUser UserPrincipal currentUser) {
        
        Map<BookStatus, Long> stats = libraryBookService.getLibraryStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<LibraryBook>> getRecentlyReadBooks(
            @CurrentUser UserPrincipal currentUser) {
        
        List<LibraryBook> books = libraryBookService.getRecentlyReadBooks(currentUser.getId());
        return ResponseEntity.ok(books);
    }

    // Request classes
    public static class UpdateStatusRequest {
        private BookStatus status;
        private Integer progress;

        // Getters and setters
        public BookStatus getStatus() {
            return status;
        }

        public void setStatus(BookStatus status) {
            this.status = status;
        }

        public Integer getProgress() {
            return progress;
        }

        public void setProgress(Integer progress) {
            this.progress = progress;
        }
    }

    public static class UpdateProgressRequest {
        @jakarta.validation.constraints.NotNull(message = "Progress is required")
        @jakarta.validation.constraints.Min(value = 0, message = "Progress must be at least 0")
        @jakarta.validation.constraints.Max(value = 100, message = "Progress must be at most 100")
        private Integer progress;

        // Getters and setters
        public Integer getProgress() {
            return progress;
        }

        public void setProgress(Integer progress) {
            this.progress = progress;
        }
    }

    public static class UpdateRatingRequest {
        @jakarta.validation.constraints.NotNull(message = "Rating is required")
        @jakarta.validation.constraints.Min(value = 1, message = "Rating must be at least 1")
        @jakarta.validation.constraints.Max(value = 5, message = "Rating must be at most 5")
        private Integer rating;

        private String review;

        // Getters and setters
        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getReview() {
            return review;
        }

        public void setReview(String review) {
            this.review = review;
        }
    }

    public static class UpdateTagsRequest {
        @jakarta.validation.constraints.NotNull(message = "Tags are required")
        private List<String> tags;

        // Getters and setters
        public List<String> getTags() {
            return tags;
        }

        public void setTags(List<String> tags) {
            this.tags = tags;
        }
    }
}
