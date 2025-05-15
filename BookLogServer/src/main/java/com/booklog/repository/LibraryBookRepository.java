package com.booklog.repository;

import com.booklog.entity.LibraryBook;
import com.booklog.entity.LibraryBook.BookStatus;
import com.booklog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryBookRepository extends JpaRepository<LibraryBook, Long> {
    
    Page<LibraryBook> findByUser(User user, Pageable pageable);
    
    Page<LibraryBook> findByUserAndStatus(User user, BookStatus status, Pageable pageable);
    
    Optional<LibraryBook> findByUserAndBookId(User user, Long bookId);
    
    @Query("SELECT lb FROM LibraryBook lb WHERE lb.user = :user AND " +
           "(:status IS NULL OR lb.status = :status) AND " +
           "(:tag IS NULL OR :tag MEMBER OF lb.tags)")
    Page<LibraryBook> findByUserAndStatusAndTag(
            @Param("user") User user,
            @Param("status") BookStatus status,
            @Param("tag") String tag,
            Pageable pageable);
    
    @Query("SELECT COUNT(lb) FROM LibraryBook lb WHERE lb.user = :user AND lb.status = :status")
    long countByUserAndStatus(@Param("user") User user, @Param("status") BookStatus status);
    
    @Query("SELECT lb.status, COUNT(lb) FROM LibraryBook lb WHERE lb.user = :user GROUP BY lb.status")
    List<Object[]> countByUserGroupByStatus(@Param("user") User user);
    
    List<LibraryBook> findTop5ByUserAndStatusOrderByLastReadDateDesc(User user, BookStatus status);
    
    boolean existsByUserAndBookId(User user, Long bookId);
}
