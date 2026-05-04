package com.englishapp.repositoty;

import com.englishapp.entity.PracticeSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Integer> {

    List<PracticeSession> findByUser_UserId(Integer userId);
}
