package com.englishapp.service;

import com.englishapp.dto.profile.ProfileRequest;
import com.englishapp.dto.profile.ProfileResponse;
import com.englishapp.dto.profile.ProfileUpdateRequest;
import com.englishapp.entity.Profile;

import java.util.List;

public interface ProfileService {
    ProfileResponse create(ProfileRequest profileRequest , Integer userId);

    ProfileResponse update(ProfileUpdateRequest profileUpdateRequest, Integer profileId);

    ProfileResponse findById(Integer id);

}
