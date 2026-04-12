package com.englishapp.repositoty;

import com.englishapp.entity.UserRole;
import com.englishapp.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

}
