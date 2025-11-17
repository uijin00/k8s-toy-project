package gmg.profile_service.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileRequest {

    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 100, message = "이름은 100자 이내로 입력해주세요.")
    private String name;

    @Size(max = 500, message = "소개는 500자 이내로 입력해주세요.")
    private String intro;

    private String strengths;

    @Size(max = 100, message = "직무는 100자 이내로 입력해주세요.")
    private String job;
}
