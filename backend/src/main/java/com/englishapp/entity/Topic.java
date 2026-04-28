package com.englishapp.entity;


import com.englishapp.entity.enums.Level;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "topic")
@Getter
@Setter
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Integer topicId;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column(name = "topic_name")
    private String topicName;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level")
    private Level difficultyLevel;

    @Column(name = "created_date")
    private LocalDateTime createdDate;
}
