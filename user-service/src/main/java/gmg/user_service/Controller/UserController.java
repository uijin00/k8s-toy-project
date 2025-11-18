package gmg.user_service.Controller;

import gmg.user_service.Configuration.JwtTokenProvider;
import gmg.user_service.DTO.LoginResponse;
import gmg.user_service.DTO.UserDTO;
import gmg.user_service.DTO.UserRequest;
import gmg.user_service.Entity.User;
import gmg.user_service.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 로그인 - JWT 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest userRequest) {
        try {
            // Spring Security를 통한 인증 수행
            // UserService.loadUserByUsername()이 자동 호출되어 사용자 조회
            // PasswordEncoder가 자동으로 비밀번호 검증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userRequest.getName(),
                            userRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // JWT 토큰 생성
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userRequest.getName());

            return ResponseEntity.ok(new LoginResponse(
                    accessToken,
                    refreshToken,
                    "User"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("로그인 실패: 사용자명 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequest userRequest) {
        try {
            // 닉네임 중복 확인
            if (userService.checkName(userRequest.getName())) {
                return ResponseEntity.badRequest()
                        .body("이미 사용 중인 닉네임입니다.");
            }

            // 사용자 등록 (비밀번호는 UserService에서 자동 암호화)
            User user = new User(userRequest.getName(), userRequest.getPassword());
            userService.save(user);

            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("회원가입 실패: " + e.getMessage());
        }
    }

    // 닉네임 중복 확인
    @GetMapping("/check-name")
    public ResponseEntity<?> checkName(@RequestParam String name) {
        boolean exists = userService.checkName(name);
        if (exists) {
            return ResponseEntity.ok("사용 중인 닉네임입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 닉네임입니다.");
        }
    }

    // Refresh Token으로 새로운 Access Token 발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        try {
            String token = refreshToken.substring(5); // "User " 제거

            if (jwtTokenProvider.validateToken(token)) {
                String name = jwtTokenProvider.getUsernameFromToken(token);

                // 새로운 Access Token 생성
                User user = userService.getUserByName(name);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        name, null, new ArrayList<>()
                );

                String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);

                return ResponseEntity.ok(new LoginResponse(
                        newAccessToken,
                        token,
                        "User"
                ));
            }

            return ResponseEntity.badRequest().body("유효하지 않은 Refresh Token입니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("토큰 갱신 실패: " + e.getMessage());
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("로그아웃되었습니다.");
    }

    // 사용자명으로 사용자 ID 조회 (Profile Service 용)
    @GetMapping("/username/{name}")
    public ResponseEntity<?> getUserIdByUsername(@PathVariable String name) {
        try {
            User user = userService.getUserByName(name);

            // User 엔티티를 UserDTO로 변환
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            // (UserDTO에 다른 필드가 있다면 여기서 마저 채웁니다)

            return ResponseEntity.ok(userDTO);

        } catch (UsernameNotFoundException e) { // 3. (권장) 더 구체적인 예외 처리
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("사용자를 찾을 수 없습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류: " + e.getMessage());
        }
    }

//    // 사용자 ID로 존재 여부 확인 (Profile Service 용)
//    @GetMapping("/{userId}/exists")
//    public ResponseEntity<?> userExists(@PathVariable UUID userId) {
//        try {
//            boolean exists = userService.existsById(userId);
//            return ResponseEntity.ok(exists);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body("로그인 실패: 사용자명 또는 비밀번호가 올바르지 않습니다.");
//        }
//    }

}