package com.booklog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "library_books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryBook extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookStatus status;

    @Column(name = "added_date", nullable = false)
    private LocalDate addedDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "finish_date")
    private LocalDate finishDate;

    @Column(name = "user_rating")
    private Integer userRating;

    @Column(name = "user_review", length = 4000)
    private String userReview;

    @Column(name = "progress", nullable = false)
    private Integer progress;

    @Column(name = "last_read_date")
    private LocalDate lastReadDate;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> tags = new HashSet<>();

    @Column(name = "favorite")
    private boolean favorite;

    @Column(name = "notes_count")
    private Integer notesCount;

    @Column(name = "highlights_count")
    private Integer highlightsCount;

    @Column(name = "reading_sessions_count")
    private Integer readingSessionsCount;

    public enum BookStatus {
        TO_READ, READING, FINISHED, ABANDONED
    }
}
