package com.englishapp.repositoty;

import com.englishapp.entity.PracticeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion, Integer> {
}
