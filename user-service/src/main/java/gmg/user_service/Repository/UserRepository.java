package gmg.user_service.Repository;

import gmg.user_service.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Spring Security가 사용자 조회할 때 사용
    Optional<User> findByName(String name);

    // 닉네임 중복 확인
    boolean existsByName(String name);
}
