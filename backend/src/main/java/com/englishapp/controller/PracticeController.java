package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.PracticeHistory.PracticeHistoryResponse;
import com.englishapp.dto.question.PracticeSessionDetailResponse;
import com.englishapp.service.PracticeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@AllArgsConstructor

@RequestMapping("/api/practice")

public class PracticeController {
    private final PracticeService practiceService;


    @GetMapping("/history")
    public ApiResponse<List<PracticeHistoryResponse>> getHistory() {
        List<PracticeHistoryResponse> practiceHistoryResponseList = practiceService.getPracticeHistory();

        return new ApiResponse<>(true, practiceHistoryResponseList, "Get history successfully");

    }

    @GetMapping("/session/{sessionId}")
    public ApiResponse<PracticeSessionDetailResponse> getSessionDetail(@PathVariable Integer sessionId) {

        return new ApiResponse<>(true, practiceService.getSessionDetail(sessionId), "Get session detail successfully");
    }


}
