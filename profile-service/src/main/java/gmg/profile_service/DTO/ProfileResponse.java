package gmg.profile_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private UUID userId;
    private String name;
    private String intro;
    private String strengths;
    private String job;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
