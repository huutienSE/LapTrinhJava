package com.englishapp.repositoty;

import com.englishapp.entity.PracticeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion, Integer> {
    List<PracticeQuestion> findByTopic_TopicId(Integer topicId);
}
