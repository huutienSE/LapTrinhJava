package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.practice.AnswerRequest;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.security.UserPrincipal;
import com.englishapp.service.AssessmentService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/user/assessment")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping("/start")
    public ApiResponse<Object> startAssessment(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ApiResponse<>(
                true,
                assessmentService.startAssessment(userPrincipal.getUserId()),
                "Start assessment successfully"
        );
    }

    @PostMapping("/commit")
    public ApiResponse<Object> commitAssessment(@RequestBody CommitAssessmentRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ApiResponse<>(
                true,
                assessmentService.commitAssessment(request, userPrincipal.getUserId()),
                "Commit assessment successfully"
        );
    }

    @GetMapping("/history")
    public ApiResponse<Object> viewHistoryAssessment(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ApiResponse<>(
                true,
                assessmentService.viewHistoryAssessmentResponses(userPrincipal.getUserId()),
                "View history assessment successfully"
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<Object> getAssessmentDetail(@PathVariable Integer id, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ApiResponse<>(
                true,
                assessmentService.getAssessmentDetail(id, userPrincipal.getUserId()),
                "Get assessment detail successfully"
        );
    }

    @PostMapping("/{sessionId}/answers")
    public ApiResponse<Object> answerQuestionAssessment(@PathVariable Integer sessionId, @RequestBody AnswerRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ApiResponse<>(
                true,
                assessmentService.answerQuestionAssessment(userPrincipal.getUserId() , request , sessionId),
                "Answer question successfully"
        );
    }
}