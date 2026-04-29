package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.StartAssessmentRequest;
import com.englishapp.service.AssessmentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/assessment")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping("/start")
    public ApiResponse<Object> startAssessment(@RequestBody StartAssessmentRequest request) {
        Integer sessionId = assessmentService.startAssessment(request);

        return new ApiResponse<>(
                true,
                sessionId,
                "Start assessment successfully"
        );
    }

    @PostMapping("/commit")
    public ApiResponse<Object> commitAssessment(@RequestBody CommitAssessmentRequest request) {
        return new ApiResponse<>(
                true,
                assessmentService.commitAssessment(request),
                "Commit assessment successfully"
        );
    }
}
