package com.booklog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(name = "subtitle")
    private String subtitle;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> authors = new ArrayList<>();

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "published_date")
    private LocalDate publishedDate;

    @Column(name = "description", length = 4000)
    private String description;

    @Column(name = "page_count")
    private Integer pageCount;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> categories = new ArrayList<>();

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "language")
    private String language;

    @Column(name = "isbn10")
    private String isbn10;

    @Column(name = "isbn13")
    private String isbn13;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "ratings_count")
    private Integer ratingsCount;

    @Column(name = "preview_link")
    private String previewLink;

    @Column(name = "info_link")
    private String infoLink;
}
