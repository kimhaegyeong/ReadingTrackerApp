package com.booklog.service;

import com.booklog.entity.Book;
import com.booklog.entity.LibraryBook;
import com.booklog.entity.LibraryBook.BookStatus;
import com.booklog.entity.User;
import com.booklog.exception.ResourceNotFoundException;
import com.booklog.repository.LibraryBookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LibraryBookService {

    private final LibraryBookRepository libraryBookRepository;
    private final UserService userService;
    private final BookService bookService;

    public LibraryBookService(LibraryBookRepository libraryBookRepository, 
                              UserService userService,
                              BookService bookService) {
        this.libraryBookRepository = libraryBookRepository;
        this.userService = userService;
        this.bookService = bookService;
    }

    public Page<LibraryBook> getUserLibrary(Long userId, Pageable pageable) {
        User user = userService.getUserById(userId);
        return libraryBookRepository.findByUser(user, pageable);
    }

    public Page<LibraryBook> getUserLibraryByStatus(Long userId, BookStatus status, Pageable pageable) {
        User user = userService.getUserById(userId);
        return libraryBookRepository.findByUserAndStatus(user, status, pageable);
    }

    public Page<LibraryBook> getUserLibraryByStatusAndTag(Long userId, BookStatus status, String tag, Pageable pageable) {
        User user = userService.getUserById(userId);
        return libraryBookRepository.findByUserAndStatusAndTag(user, status, tag, pageable);
    }

    public LibraryBook getUserLibraryBook(Long userId, Long bookId) {
        User user = userService.getUserById(userId);
        return libraryBookRepository.findByUserAndBookId(user, bookId)
                .orElseThrow(() -> new ResourceNotFoundException("LibraryBook", "bookId", bookId));
    }

    public boolean isBookInUserLibrary(Long userId, Long bookId) {
        User user = userService.getUserById(userId);
        return libraryBookRepository.existsByUserAndBookId(user, bookId);
    }

    @Transactional
    public LibraryBook addBookToLibrary(Long userId, Long bookId, BookStatus status) {
        User user = userService.getUserById(userId);
        Book book = bookService.getBookById(bookId);
        
        // Check if book is already in library
        Optional<LibraryBook> existingBook = libraryBookRepository.findByUserAndBookId(user, bookId);
        if (existingBook.isPresent()) {
            throw new IllegalArgumentException("Book is already in user's library");
        }
        
        LibraryBook libraryBook = LibraryBook.builder()
                .user(user)
                .book(book)
                .status(status)
                .addedDate(LocalDate.now())
                .progress(0)
                .favorite(false)
                .notesCount(0)
                .highlightsCount(0)
                .readingSessionsCount(0)
                .build();
        
        if (status == BookStatus.READING) {
            libraryBook.setStartDate(LocalDate.now());
        } else if (status == BookStatus.FINISHED) {
            libraryBook.setStartDate(LocalDate.now());
            libraryBook.setFinishDate(LocalDate.now());
            libraryBook.setProgress(100);
        }
        
        return libraryBookRepository.save(libraryBook);
    }

    @Transactional
    public LibraryBook updateBookStatus(Long userId, Long bookId, BookStatus status, Integer progress) {
        LibraryBook libraryBook = getUserLibraryBook(userId, bookId);
        
        // Update status
        libraryBook.setStatus(status);
        
        // Update dates based on status
        if (status == BookStatus.READING && libraryBook.getStartDate() == null) {
            libraryBook.setStartDate(LocalDate.now());
        } else if (status == BookStatus.FINISHED) {
            if (libraryBook.getStartDate() == null) {
                libraryBook.setStartDate(LocalDate.now());
            }
            libraryBook.setFinishDate(LocalDate.now());
            libraryBook.setProgress(100);
        }
        
        // Update progress if provided
        if (progress != null) {
            libraryBook.setProgress(progress);
        }
        
        // Update last read date
        libraryBook.setLastReadDate(LocalDate.now());
        
        return libraryBookRepository.save(libraryBook);
    }

    @Transactional
    public LibraryBook updateBookProgress(Long userId, Long bookId, Integer progress) {
        LibraryBook libraryBook = getUserLibraryBook(userId, bookId);
        
        // Update progress
        libraryBook.setProgress(progress);
        
        // Update last read date
        libraryBook.setLastReadDate(LocalDate.now());
        
        // If progress is 100%, update status to FINISHED
        if (progress == 100 && libraryBook.getStatus() != BookStatus.FINISHED) {
            libraryBook.setStatus(BookStatus.FINISHED);
            libraryBook.setFinishDate(LocalDate.now());
        }
        
        return libraryBookRepository.save(libraryBook);
    }

    @Transactional
    public LibraryBook updateBookRating(Long userId, Long bookId, Integer rating, String review) {
        LibraryBook libraryBook = getUserLibraryBook(userId, bookId);
        
        // Update rating and review
        libraryBook.setUserRating(rating);
        if (review != null) {
            libraryBook.setUserReview(review);
        }
        
        return libraryBookRepository.save(libraryBook);
    }

    @Transactional
    public LibraryBook updateBookTags(Long userId, Long bookId, List<String> tags) {
        LibraryBook libraryBook = getUserLibraryBook(userId, bookId);
        
        // Update tags
        libraryBook.setTags(tags.stream().collect(Collectors.toSet()));
        
        return libraryBookRepository.save(libraryBook);
    }

    @Transactional
    public LibraryBook toggleFavorite(Long userId, Long bookId) {
        LibraryBook libraryBook = getUserLibraryBook(userId, bookId);
        
        // Toggle favorite status
        libraryBook.setFavorite(!libraryBook.isFavorite());
        
        return libraryBookRepository.save(libraryBook);
    }

    @Transactional
    public void removeBookFromLibrary(Long userId, Long bookId) {
        LibraryBook libraryBook = getUserLibraryBook(userId, bookId);
        libraryBookRepository.delete(libraryBook);
    }

    public Map<BookStatus, Long> getLibraryStats(Long userId) {
        User user = userService.getUserById(userId);
        List<Object[]> stats = libraryBookRepository.countByUserGroupByStatus(user);
        
        return stats.stream()
                .collect(Collectors.toMap(
                        row -> (BookStatus) row[0],
                        row -> (Long) row[1]
                ));
    }

    public List<LibraryBook> getRecentlyReadBooks(Long userId) {
        User user = userService.getUserById(userId);
        return libraryBookRepository.findTop5ByUserAndStatusOrderByLastReadDateDesc(user, BookStatus.READING);
    }
}
