package com.booklog.repository;

import com.booklog.entity.ReadingGoal;
import com.booklog.entity.ReadingGoal.GoalPeriod;
import com.booklog.entity.ReadingGoal.GoalType;
import com.booklog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingGoalRepository extends JpaRepository<ReadingGoal, Long> {
    
    Page<ReadingGoal> findByUser(User user, Pageable pageable);
    
    List<ReadingGoal> findByUserAndCompletedFalse(User user);
    
    List<ReadingGoal> findByUserAndCompletedTrue(User user);
    
    Optional<ReadingGoal> findByUserAndTypeAndPeriodAndCompletedFalse(
            User user, GoalType type, GoalPeriod period);
    
    @Query("SELECT rg FROM ReadingGoal rg WHERE rg.user = :user AND " +
           "rg.startDate <= :currentDate AND " +
           "(rg.endDate IS NULL OR rg.endDate >= :currentDate) AND " +
           "rg.completed = false")
    List<ReadingGoal> findActiveGoals(@Param("user") User user, @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT COUNT(rg) FROM ReadingGoal rg WHERE rg.user = :user AND " +
           "rg.completed = true AND rg.type = :type")
    long countCompletedGoalsByType(@Param("user") User user, @Param("type") GoalType type);
    
    @Query("SELECT rg.period, COUNT(rg) FROM ReadingGoal rg WHERE rg.user = :user AND " +
           "rg.completed = true GROUP BY rg.period")
    List<Object[]> countCompletedGoalsByPeriod(@Param("user") User user);
    
    @Query("SELECT YEAR(rg.endDate), MONTH(rg.endDate), COUNT(rg) FROM ReadingGoal rg WHERE " +
           "rg.user = :user AND rg.completed = true AND rg.endDate IS NOT NULL " +
           "GROUP BY YEAR(rg.endDate), MONTH(rg.endDate) " +
           "ORDER BY YEAR(rg.endDate), MONTH(rg.endDate)")
    List<Object[]> countCompletedGoalsByMonth(@Param("user") User user);
}
