package gmg.profile_service.Repository;

import gmg.profile_service.Entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    // 사용자 ID로 프로필 조회
    Optional<Profile> findByUserId(UUID userId);

    // 사용자 ID로 프로필 존재 여부 확인
    boolean existsByUserId(UUID userId);

    // 사용자 ID로 프로필 삭제
    void deleteByUserId(UUID userId);
}
