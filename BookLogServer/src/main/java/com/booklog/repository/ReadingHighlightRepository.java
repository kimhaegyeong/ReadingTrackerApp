package com.booklog.repository;

import com.booklog.entity.Book;
import com.booklog.entity.ReadingHighlight;
import com.booklog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingHighlightRepository extends JpaRepository<ReadingHighlight, Long> {
    
    Page<ReadingHighlight> findByUser(User user, Pageable pageable);
    
    Page<ReadingHighlight> findByUserAndBook(User user, Book book, Pageable pageable);
    
    Page<ReadingHighlight> findByUserAndIsFavoriteTrue(User user, Pageable pageable);
    
    @Query("SELECT rh FROM ReadingHighlight rh WHERE rh.user = :user AND " +
           "(:tag IS NULL OR :tag MEMBER OF rh.tags)")
    Page<ReadingHighlight> findByUserAndTag(@Param("user") User user, @Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT rh FROM ReadingHighlight rh WHERE rh.user = :user AND " +
           "(LOWER(rh.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(rh.note) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ReadingHighlight> searchHighlights(@Param("user") User user, @Param("query") String query, Pageable pageable);
    
    @Query("SELECT rh FROM ReadingHighlight rh WHERE rh.user = :user " +
           "ORDER BY rh.date DESC")
    List<ReadingHighlight> findRecentHighlights(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT COUNT(rh) FROM ReadingHighlight rh WHERE rh.user = :user AND rh.book = :book")
    long countByUserAndBook(@Param("user") User user, @Param("book") Book book);
}
