package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.profile.ProfileRequest;
import com.englishapp.dto.profile.ProfileResponse;
import com.englishapp.dto.profile.ProfileUpdateRequest;
import com.englishapp.service.ProfileService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/all")
    public ApiResponse<Iterable<ProfileResponse>> findAll() {
        Iterable<ProfileResponse> response = profileService.findAll();
        return new ApiResponse<>(true, response, "Get all profile success");
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProfileResponse> create(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.create(request);
        return new ApiResponse<>(true, response, "Create profile success");
    }

    @GetMapping("/{id}")
    public ApiResponse<ProfileResponse> findById(@PathVariable Integer id) {
        ProfileResponse response = profileService.findById(id);
        return new ApiResponse<>(true, response, "Get profile by id success");
    }

    @PutMapping("/{id}")
    public ApiResponse<ProfileResponse> update(@RequestBody ProfileUpdateRequest request, @PathVariable Integer id) {
        ProfileResponse response = profileService.update(request, id);
        return new ApiResponse<>(true, response, "Update profile success");
    }

}
