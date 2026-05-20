package com.englishapp.repositoty;

import com.englishapp.entity.Role;
import com.englishapp.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// JpaRepository<T, ID> truyền vào đối tượng kiểu T và kiểu của ID ID
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(RoleName roleName);
}
