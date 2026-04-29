package com.englishapp.repositoty;

import com.englishapp.entity.Question;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query(value = """
        SELECT * FROM question
        WHERE topic_id = :topicId AND difficulty_level = :level
        ORDER BY RAND()
        LIMIT :limit
    """, nativeQuery = true)
    List<Question> findRandomByLevel(
            @Param("topicId") Integer topicId,
            @Param("level") String level,
            @Param("limit") int limit
    );
}