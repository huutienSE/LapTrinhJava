package com.englishapp.entity;

import com.englishapp.entity.enums.Level;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessment")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Integer assessmentId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(name = "level_assigned")
    private Level levelAssigned;

    @Column(name = "taken_date")
    private LocalDateTime takenDate;
}
