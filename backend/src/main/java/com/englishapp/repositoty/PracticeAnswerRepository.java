package com.englishapp.repositoty;

import com.englishapp.entity.PracticeAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeAnswerRepository extends JpaRepository<PracticeAnswer, Integer> {

    List<PracticeAnswer> findBySession_SessionId(Integer sessionId);
}
