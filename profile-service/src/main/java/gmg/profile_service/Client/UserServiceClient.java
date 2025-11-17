package gmg.profile_service.Client;

import gmg.profile_service.DTO.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserServiceClient {
    // 사용자 존재 여부 확인
    @GetMapping("/api/users/{userId}/exists")
    boolean userExists(@PathVariable("userId") UUID userId);

    // 사용자 정보 조회 (필요시)
    @GetMapping("/api/users/{userId}")
    UserDTO getUser(@PathVariable("userId") UUID userId);

    // 사용자명으로 사용자 정보 조회
    @GetMapping("/user/username/{name}")
    UserDTO getUserByName(@PathVariable("name") String name);
}
