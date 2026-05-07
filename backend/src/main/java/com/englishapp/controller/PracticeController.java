package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.PracticeHistory.PracticeHistoryResponse;
import com.englishapp.dto.question.PracticeSessionDetailResponse;
import com.englishapp.security.UserPrincipal;
import com.englishapp.service.PracticeService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@AllArgsConstructor

@RequestMapping("/api/user/practice")

public class PracticeController {
    private final PracticeService practiceService;


    @GetMapping("/history")
    public ApiResponse<List<PracticeHistoryResponse>> getHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PracticeHistoryResponse> practiceHistoryResponseList = practiceService.getPracticeHistory(userPrincipal.getUserId());

        return new ApiResponse<>(true, practiceHistoryResponseList, "Get history successfully");

    }

    @GetMapping("/session/{sessionId}")
    public ApiResponse<PracticeSessionDetailResponse> getSessionDetail(@PathVariable Integer sessionId,
                                                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {

        return new ApiResponse<>(true, practiceService.getSessionDetail(sessionId,
                userPrincipal.getUserId()), "Get session detail successfully");
    }


}
