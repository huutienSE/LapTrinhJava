package com.englishapp.repositoty;

import com.englishapp.entity.PracticeAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PracticeAnswerRepository extends JpaRepository<PracticeAnswer, Integer> {

    @Query("""
            SELECT DISTINCT a FROM PracticeAnswer a\s
            LEFT JOIN FETCH a.feedback
            JOIN FETCH a.practiceQuestion pq
            JOIN FETCH pq.question q
            WHERE pq.session.sessionId = :sessionId                    
            """)

//    @Query("""
//    SELECT DISTINCT a FROM PracticeAnswer a
//    LEFT JOIN FETCH a.feedback
//    JOIN FETCH a.practiceQuestion pq
//    JOIN FETCH pq.question q
//    JOIN FETCH pq.session s
//    JOIN FETCH s.topic
//    WHERE s.sessionId = :sessionId
//""")
    List<PracticeAnswer> findBySessionWithDetails(Integer sessionId);
}
