package com.englishapp.repositoty;

import com.englishapp.entity.PracticeQuestion;
import com.englishapp.entity.PracticeQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion, PracticeQuestionId> {

}
