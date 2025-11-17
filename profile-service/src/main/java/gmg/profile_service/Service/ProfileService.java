package gmg.profile_service.Service;

import gmg.profile_service.Client.UserServiceClient;
import gmg.profile_service.DTO.ProfileRequest;
import gmg.profile_service.DTO.ProfileResponse;
import gmg.profile_service.DTO.ProfileSummary;
import gmg.profile_service.Entity.Profile;
import gmg.profile_service.Repository.ProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private UserServiceClient userServiceClient;

    // 프로필 생성
    @Transactional
    public ProfileResponse createProfile(UUID userId, ProfileRequest request) {
        Profile profile = Profile.builder()
                .userId(userId)
                .name(request.getName())
                .intro(request.getIntro())
                .strengths(request.getStrengths())
                .job(request.getJob())
                .build();

        Profile savedProfile = profileRepository.save(profile);
        return toResponse(savedProfile);
    }

    // ID로 특정 프로필 조회
    public ProfileResponse getProfileById(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));
        return toResponse(profile);
    }

    // 모든 프로필 목록 조회
    public List<ProfileSummary> getAllProfiles() {
        return profileRepository.findAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    // 프로필 삭제
    @Transactional
    public void deleteProfile(UUID userId) {
        if (!profileRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException("프로필을 찾을 수 없습니다.");
        }
        profileRepository.deleteByUserId(userId);
    }

    // Entity -> Response DTO 변환
    private ProfileResponse toResponse(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .name(profile.getName())
                .intro(profile.getIntro())
                .strengths(profile.getStrengths())
                .job(profile.getJob())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    // Entity -> Summary DTO 변환
    private ProfileSummary toSummary(Profile profile) {
        return ProfileSummary.builder()
                .id(profile.getId())
                .name(profile.getName())
                .intro(profile.getIntro())
                .job(profile.getJob())
                .build();
    }
}
