package gmg.user_service.Service;

import gmg.user_service.Entity.User;
import gmg.user_service.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    
     // Spring Security가 로그인 시 자동으로 호출하는 메서드
     // 사용자 정보를 조회하고 비밀번호 검증은 Spring Security가 자동 처리
    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + name));

        // User 엔티티를 Spring Security의 UserDetails로 변환
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getName())
                .password(user.getPassword()) // 이미 암호화된 비밀번호
                .authorities(new ArrayList<>()) // 권한 정보 (필요시 추가)
                .build();
    }

    // 닉네임 중복 확인
    public boolean checkName(String name) {
        try {
            return userRepository.existsByName(name);
        } catch (Exception e) {
            return false;
        }
    }

    // 회원가입 - 비밀번호를 암호화하여 저장
    public void save(User user) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);
    }

    // 사용자 조회
    public User getUserByName(String name) {
        return userRepository.findByName(name)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + name));
    }
}