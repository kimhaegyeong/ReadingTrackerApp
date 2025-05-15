package com.booklog.repository;

import com.booklog.entity.Book;
import com.booklog.entity.ReadingSession;
import com.booklog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReadingSessionRepository extends JpaRepository<ReadingSession, Long> {
    
    Page<ReadingSession> findByUser(User user, Pageable pageable);
    
    Page<ReadingSession> findByUserAndBook(User user, Book book, Pageable pageable);
    
    List<ReadingSession> findByUserAndDateBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(rs.duration) FROM ReadingSession rs WHERE rs.user = :user AND " +
           "rs.date BETWEEN :startDate AND :endDate")
    Integer getTotalReadingTime(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT FUNCTION('DATE', rs.date) as readingDate, SUM(rs.duration) as totalMinutes " +
           "FROM ReadingSession rs WHERE rs.user = :user AND " +
           "rs.date BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('DATE', rs.date) " +
           "ORDER BY readingDate")
    List<Object[]> getDailyReadingTime(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(DISTINCT FUNCTION('DATE', rs.date)) FROM ReadingSession rs " +
           "WHERE rs.user = :user AND rs.date >= :startDate")
    Integer getReadingStreak(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT rs.book.id, COUNT(rs) as sessionCount, SUM(rs.duration) as totalTime " +
           "FROM ReadingSession rs WHERE rs.user = :user " +
           "GROUP BY rs.book.id ORDER BY totalTime DESC")
    List<Object[]> getMostReadBooks(@Param("user") User user, Pageable pageable);
}
