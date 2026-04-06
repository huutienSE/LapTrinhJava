package com.englishapp.entity;

import com.englishapp.entity.enums.Action;
import com.englishapp.entity.enums.TargetType;
import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "admin_log")
public class AdminLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @Column(name = "admin_id")
    private Integer adminId;

    @Enumerated(EnumType.STRING)
    private Action action;

    @Column(name = "target_user_id")
    private Integer targetUserId;

    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    @Column(name = "created_date")
    private LocalDateTime createdDate;
}