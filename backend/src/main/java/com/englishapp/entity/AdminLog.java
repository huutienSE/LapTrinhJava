package com.englishapp.entity;

import com.englishapp.entity.enums.AdminAction;
import com.englishapp.entity.enums.TargetType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_log")
@Getter
@Setter
public class AdminLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @Enumerated(EnumType.STRING)
    private AdminAction action;

    @Column(name = "target_user_id")
    private Integer targetUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type")
    private TargetType targetType;

    @Column(name = "created_date")
    private LocalDateTime createdDate;
}
