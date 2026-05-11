package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.question.QuestionRequest;
import com.englishapp.dto.question.QuestionResponse;
import com.englishapp.service.QuestionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/questions")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ApiResponse<List<QuestionResponse>> getAllQuestions() {
        List<QuestionResponse> questionResponses = questionService.getAllQuestions();
        return new ApiResponse<>(true, questionResponses, "success");
    }

    @PostMapping
    public ApiResponse<QuestionResponse> createQuestion( @Valid @RequestBody QuestionRequest questionRequest) {
        return new ApiResponse<>(
                true,
                questionService.createQuestion(questionRequest),
                "create question successfully"
        );
    }

    @DeleteMapping("/{questionId}")
    public ApiResponse<Void> deleteQuestion( @PathVariable Integer questionId) {
        questionService.deleteQuestionById(questionId);
        return new ApiResponse<>(
                true,
                null,
                "delete question successfully"
        );
    }

    @GetMapping("/{questionId}")
    public ApiResponse<QuestionResponse> getQuestionById(@PathVariable Integer questionId) {
        return new ApiResponse<>(
                true,
                questionService.getQuestionById(questionId),
                "get question successfully"
        );
    }

    @PutMapping("/{questionId}")
    public ApiResponse<QuestionResponse> updateQuestion(@Valid @RequestBody QuestionRequest questionRequest, @PathVariable Integer questionId) {
        return new ApiResponse<>(
                true,
                questionService.updateQuestion(questionRequest, questionId),
                "update question successfully"
        );
    }
}
