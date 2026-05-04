package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.PracticeHistory.PracticeHistoryResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@AllArgsConstructor

@RequestMapping("/api/practice")

public class PracticeController {

    @GetMapping("/history/{userId}")
    public ApiResponse<List<PracticeHistoryResponse>> getHistory(@PathVariable Integer userId) {
        List<PracticeHistoryResponse> practiceHistoryResponseList = new ArrayList<>();

    }
}
