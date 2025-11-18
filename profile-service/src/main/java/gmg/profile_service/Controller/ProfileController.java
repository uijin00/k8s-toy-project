package gmg.profile_service.Controller;

import gmg.profile_service.Configuration.JwtTokenProvider;
import gmg.profile_service.DTO.ProfileRequest;
import gmg.profile_service.DTO.ProfileResponse;
import gmg.profile_service.DTO.ProfileSummary;
import gmg.profile_service.DTO.UserDTO;
import gmg.profile_service.Service.ProfileService;
import gmg.profile_service.Client.UserServiceClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    @Autowired
    private ProfileService profileService;
    @Autowired
    private UserServiceClient userService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 프로필 생성 (로그인 필요)
    @PostMapping("/create")
    public ResponseEntity<?> createProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ProfileRequest request) {
        try {
            UUID userId = getUserIdFromToken(token);
            ProfileResponse response = profileService.createProfile(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("프로필 생성 실패: " + e.getMessage());
        }
    }

    // 특정 프로필 조회
    @GetMapping("/{profileId}")
    public ResponseEntity<?> getProfileById(@PathVariable Long profileId) {
        try {
            ProfileResponse response = profileService.getProfileById(profileId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 모든 프로필 조회
    @GetMapping("/all")
    public ResponseEntity<List<ProfileSummary>> getAllProfiles() {
        List<ProfileSummary> profiles = profileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProfile(@RequestHeader("Authorization") String token) {
        try {
            UUID userId = getUserIdFromToken(token);
            profileService.deleteProfile(userId);
            return ResponseEntity.ok("프로필이 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("프로필 삭제 실패: " + e.getMessage());
        }
    }

    // jwt 토큰에서 사용자 ID 추출
    private UUID getUserIdFromToken(String bearerToken) {
        String token = bearerToken.substring(7); // "Bearer " 제거

        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        String name = jwtTokenProvider.getUsernameFromToken(token);
        UserDTO userDTO = userService.getUserByName(name);

        if (userDTO == null) {
            throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다: " + name);
        }

        return userDTO.getId();
    }
}
