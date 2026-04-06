package com.englishapp.entity;

import com.englishapp.entity.enums.PlanName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Entity
@Table(name = "plan")
@Getter
@Setter
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Integer planId;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_name")
    private PlanName planName;

    private Integer price;

    @Column(name = "duration_day")
    private Integer durationDay;

    private String description;
}
