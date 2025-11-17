package gmg.profile_service.Service;

import gmg.profile_service.Client.UserServiceClient;
import gmg.profile_service.DTO.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

// Profile Service에서 User Service와 통신하기 위한 서비스
@Service
public class UserService {
    @Autowired
    private UserServiceClient userServiceClient;

    // 사용자명으로 사용자 ID 조회
    public UUID getUserIdByName(String name) {
            try {
                // Feign Client를 통해 User Service에서 사용자 정보 조회
                UserDTO user = userServiceClient.getUserByName(name);
                return user.getId();
            } catch (Exception e) {
                throw new IllegalArgumentException("사용자를 찾을 수 없습니다: " + name);
            }
    }

    // 사용자 존재 여부 확인
    public boolean userExists(UUID userId) {
        try {
            return userServiceClient.userExists(userId);
        } catch (Exception e) {
            return false;
        }
    }
}
