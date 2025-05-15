package com.booklog.repository;

import com.booklog.entity.Book;
import com.booklog.entity.ReadingNote;
import com.booklog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingNoteRepository extends JpaRepository<ReadingNote, Long> {
    
    Page<ReadingNote> findByUser(User user, Pageable pageable);
    
    Page<ReadingNote> findByUserAndBook(User user, Book book, Pageable pageable);
    
    Page<ReadingNote> findByUserAndIsFavoriteTrue(User user, Pageable pageable);
    
    @Query("SELECT rn FROM ReadingNote rn WHERE rn.user = :user AND " +
           "(:tag IS NULL OR :tag MEMBER OF rn.tags)")
    Page<ReadingNote> findByUserAndTag(@Param("user") User user, @Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT rn FROM ReadingNote rn WHERE rn.user = :user AND " +
           "(LOWER(rn.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ReadingNote> searchNotes(@Param("user") User user, @Param("query") String query, Pageable pageable);
    
    @Query("SELECT rn FROM ReadingNote rn WHERE rn.user = :user " +
           "ORDER BY rn.date DESC")
    List<ReadingNote> findRecentNotes(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT COUNT(rn) FROM ReadingNote rn WHERE rn.user = :user AND rn.book = :book")
    long countByUserAndBook(@Param("user") User user, @Param("book") Book book);
    
    @Query("SELECT DISTINCT tag FROM ReadingNote rn JOIN rn.tags tag WHERE rn.user = :user")
    List<String> findAllTagsByUser(@Param("user") User user);
}
