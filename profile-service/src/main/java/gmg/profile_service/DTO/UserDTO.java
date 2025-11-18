package gmg.profile_service.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Data
@Getter
@Setter
public class UserDTO {
    private UUID id;
    private String name;
}
