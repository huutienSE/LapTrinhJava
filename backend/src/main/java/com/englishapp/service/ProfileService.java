package com.englishapp.service;

import com.englishapp.dto.profile.ProfileRequest;
import com.englishapp.dto.profile.ProfileResponse;
import com.englishapp.dto.profile.ProfileUpdateRequest;
import com.englishapp.entity.Profile;

import java.util.List;

public interface ProfileService {
    List<ProfileResponse> findAll();

    ProfileResponse create(ProfileRequest profileRequest);

    ProfileResponse update(ProfileUpdateRequest profileUpdateRequest, Integer id);

    ProfileResponse findById(Integer id);

    ProfileResponse mapToProfileResponse(Profile profile);


}
