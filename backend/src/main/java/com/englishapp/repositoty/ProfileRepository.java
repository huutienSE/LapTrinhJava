package com.englishapp.repositoty;

import com.englishapp.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    Optional<Profile> findByUser_UserId(Integer userId);
}