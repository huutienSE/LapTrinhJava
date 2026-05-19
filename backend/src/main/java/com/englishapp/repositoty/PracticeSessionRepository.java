package com.englishapp.repositoty;

import com.englishapp.entity.PracticeSession;
import com.englishapp.entity.enums.SessionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Integer> {

    @Query("""
    SELECT s FROM PracticeSession s
    JOIN FETCH s.topic
    WHERE s.user.userId = :userId
""")
    List<PracticeSession> findByUserIdWithTopic(Integer userId);

    List<PracticeSession> findByUser_UserId(Integer userId);

    List<PracticeSession> findByUser_UserIdAndSessionTypeAndEndedTimeIsNotNullOrderByEndedTimeDesc(Integer userId, SessionType sessionType);

}
