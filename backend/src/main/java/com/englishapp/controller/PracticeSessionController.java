package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.PracticeHistory.PracticeHistoryResponse;
import com.englishapp.service.PracticeSessionService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@AllArgsConstructor

@RequestMapping("/api/practice")

public class PracticeSessionController {
    private final PracticeSessionService practiceSessionService;


    @GetMapping("/history")
    public ApiResponse<List<PracticeHistoryResponse>> getHistory() {
        List<PracticeHistoryResponse> practiceHistoryResponseList = practiceSessionService.getPracticeHistory();

        return new ApiResponse<>(true, practiceHistoryResponseList, "Get history successfully");

    }
}
