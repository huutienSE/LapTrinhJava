package com.englishapp.service.impl;

import com.englishapp.dto.profile.ProfileRequest;
import com.englishapp.dto.profile.ProfileResponse;
import com.englishapp.dto.profile.ProfileUpdateRequest;
import com.englishapp.entity.Profile;
import com.englishapp.entity.User;
import com.englishapp.entity.enums.Level;
import com.englishapp.exception.ForbiddenException;
import com.englishapp.exception.ProfileAlreadyExistsException;
import com.englishapp.exception.ProfileNotFoundException;
import com.englishapp.exception.UserNotFoundException;
import com.englishapp.repositoty.AssessmentRepository;
import com.englishapp.repositoty.ProfileRepository;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;

    @Override
    public ProfileResponse create(ProfileRequest profileRequest , Integer userId)
    {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

        profileRepository.findByUser_UserId(userId).ifPresent(p -> {throw new ProfileAlreadyExistsException(userId);});

        if (profileRequest.getBirthDate() != null && profileRequest.getBirthDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Birth date cannot be in the future");
        }

        var profile = new Profile();
        profile.setFirstName(profileRequest.getFirstName());
        profile.setLastName(profileRequest.getLastName());
        profile.setBirthDate(profileRequest.getBirthDate());
        profile.setTargetGoal(profileRequest.getTargetGoal());
        profile.setOccupation(profileRequest.getOccupation());
        profile.setUser(user);

        Profile savedProfile = profileRepository.save(profile);
        return mapToProfileResponse(savedProfile);
    }

    @Override
    public ProfileResponse update(ProfileUpdateRequest profileUpdateRequest, Integer profileId, Integer userId) {

        Profile profile = profileRepository.findById(profileId).orElseThrow(ProfileNotFoundException::new);

        if (!profile.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        if (profileUpdateRequest.getFirstName() != null) {
            profile.setFirstName(profileUpdateRequest.getFirstName());
        }

        if (profileUpdateRequest.getLastName() != null) {
            profile.setLastName(profileUpdateRequest.getLastName());
        }

        if (profileUpdateRequest.getBirthDate() != null) {
            if (profileUpdateRequest.getBirthDate().isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("Birth date cannot be in the future");
            }
            profile.setBirthDate(profileUpdateRequest.getBirthDate());
        }

        if (profileUpdateRequest.getLevel() != null) {
            boolean hasTakenAssessment = !assessmentRepository.findByUser_UserIdOrderByTakenDateDesc(userId).isEmpty();
            if (!hasTakenAssessment) {
                profile.setLevel(Level.valueOf(profileUpdateRequest.getLevel().toUpperCase()));
            }
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
                .orElseThrow(ProfileNotFoundException::new);
        return mapToProfileResponse(profile);
    }

    private ProfileResponse mapToProfileResponse(Profile profile)
    {
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setProfileId(profile.getProfileId());
        profileResponse.setUserId(profile.getUser().getUserId());
        profileResponse.setEmail(profile.getUser().getEmail());
        profileResponse.setFirstName(profile.getFirstName());
        profileResponse.setLastName(profile.getLastName());
        profileResponse.setBirthDate(profile.getBirthDate());
        profileResponse.setLevel(profile.getLevel() != null ? String.valueOf(profile.getLevel()) : null);
        profileResponse.setTargetGoal(profile.getTargetGoal());
        profileResponse.setOccupation(profile.getOccupation());
        return profileResponse;
    }

    @Override
    public ProfileResponse findByUserId(Integer userId) {
        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(ProfileNotFoundException::new);
        return mapToProfileResponse(profile);
    }
}