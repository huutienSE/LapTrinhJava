package com.englishapp.repositoty;

import com.englishapp.entity.Assessment;
import com.englishapp.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment , Integer> {
    List<Assessment> findByUser_UserIdOrderByTakenDateDesc(Integer userId);
}
