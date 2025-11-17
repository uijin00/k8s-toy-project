package gmg.profile_service.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID userId; // User Service의 사용자 ID 참조

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String intro;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(length = 100)
    private String job;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // 사용자는 하나의 프로필만 가질 수 있도록 userId를 unique로 설정
    @PrePersist
    @PreUpdate
    private void validateProfile() {
        if (userId == null) {
            throw new IllegalStateException("userId는 필수입니다.");
        }
    }
}
