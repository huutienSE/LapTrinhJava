package com.englishapp.service.impl;

import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.entity.PracticeSession;
import com.englishapp.repositoty.PracticeSessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PracticeSessionServiceImpl {
    PracticeSessionRepository practiceSessionRepository;
}
