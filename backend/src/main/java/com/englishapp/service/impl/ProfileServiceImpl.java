package com.englishapp.service.impl;

import com.englishapp.dto.profile.ProfileRequest;
import com.englishapp.dto.profile.ProfileResponse;
import com.englishapp.dto.profile.ProfileUpdateRequest;
import com.englishapp.entity.Profile;
import com.englishapp.entity.User;
import com.englishapp.entity.enums.Level;
import com.englishapp.repositoty.ProfileRepository;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    @Override
    public List<ProfileResponse> findAll() {
        return profileRepository.findAll()
                .stream()
                .map(profile -> {
                    ProfileResponse profileResponse = new ProfileResponse();
                    profileResponse.setProfileId(profile.getProfileId());
                    profileResponse.setUserId(profile.getUser().getUserId());
                    profileResponse.setFirstName(profile.getFirstName());
                    profileResponse.setLastName(profile.getLastName());
                    profileResponse.setBirthDate(profile.getBirthDate());
                    profileResponse.setLevel(String.valueOf(profile.getLevel()));
                    profileResponse.setTargetGoal(profile.getTargetGoal());
                    profileResponse.setOccupation(profile.getOccupation());
                    return profileResponse;
                })
                .toList();
    }

    @Override
    public ProfileResponse create(ProfileRequest profileRequest)
    {
        User user = userRepository.findById(profileRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var profile = new Profile();
        profile.setFirstName(profileRequest.getFirstName());
        profile.setLastName(profileRequest.getLastName());
        profile.setBirthDate(profileRequest.getBirthDate());
        profile.setLevel(Level.valueOf(profileRequest.getLevel()));
        profile.setTargetGoal(profileRequest.getTargetGoal());
        profile.setOccupation(profileRequest.getOccupation());
        profile.setUser(user);

        Profile savedProfile = profileRepository.save(profile);
        return mapToProfileResponse(savedProfile);
    }

    @Override
    public ProfileResponse update(ProfileUpdateRequest profileUpdateRequest, Integer id) {

        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (profileUpdateRequest.getFirstName() != null) {
            profile.setFirstName(profileUpdateRequest.getFirstName());
        }

        if (profileUpdateRequest.getBirthDate() != null) {
            profile.setBirthDate(profileUpdateRequest.getBirthDate());
        }

        if (profileUpdateRequest.getLevel() != null) {
            profile.setLevel(Level.valueOf(profileUpdateRequest.getLevel().toUpperCase()));
        }

        if (profileUpdateRequest.getTargetGoal() != null) {
            profile.setTargetGoal(profileUpdateRequest.getTargetGoal());
        }

        if (profileUpdateRequest.getOccupation() != null) {
            profile.setOccupation(profileUpdateRequest.getOccupation());
        }

        Profile saved = profileRepository.save(profile);

        return mapToProfileResponse(saved);
    }

    @Override
    public ProfileResponse findById(Integer id)
    {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return mapToProfileResponse(profile);
    }


    @Override
    public ProfileResponse mapToProfileResponse(Profile profile)
    {
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setProfileId(profile.getProfileId());
        profileResponse.setUserId(profile.getUser().getUserId());
        profileResponse.setFirstName(profile.getFirstName());
        profileResponse.setLastName(profile.getLastName());
        profileResponse.setBirthDate(profile.getBirthDate());
        profileResponse.setLevel(String.valueOf(profile.getLevel()));
        profileResponse.setTargetGoal(profile.getTargetGoal());
        profileResponse.setOccupation(profile.getOccupation());
        return profileResponse;
    }
}