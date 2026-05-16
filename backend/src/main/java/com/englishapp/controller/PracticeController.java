package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.practice.PracticeHistoryResponse;
import com.englishapp.dto.practice.PracticeSessionDetailResponse;
import com.englishapp.dto.practice.StartPracticeRequest;
import com.englishapp.dto.practice.StartPracticeResponse;
import com.englishapp.security.UserPrincipal;
import com.englishapp.service.PracticeService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/practice")

public class PracticeController {

    private final PracticeService practiceService;

//    @PostMapping("/start")
//    public ApiResponse<StartPracticeResponse> startPractice(@RequestBody StartPracticeRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
//
//        StartPracticeResponse response = practiceService.startPractice(request.getTopicId(), userPrincipal.getUserId());
//
//        return new ApiResponse<>(true, response, "Start practice successfully");
//    }

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
