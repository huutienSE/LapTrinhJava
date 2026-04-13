package com.englishapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_role")
@Getter
@Setter
@RequiredArgsConstructor
public class UserRole {
    @EmbeddedId
    private UserRoleId id;


    public UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
        this.id = new UserRoleId(user.getUserId(), role.getRoleId());
    }

    @ManyToOne
    @MapsId("userId") // map vào field userId trong UserRoleId
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("roleId") // map vào field roleId trong UserRoleId
    @JoinColumn(name = "role_id")
    private Role role;
}
