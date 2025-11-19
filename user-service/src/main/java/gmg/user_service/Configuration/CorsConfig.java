package gmg.user_service.Configuration;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.CorsFilter;


import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 프론트엔드 주소 허용
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",     // React 개발 서버
                "http://myprofile.com",     // Ingress가 접속할 도메인
		"http://a0f1cebecb1c3433e980da228acf9e36-1548100285.ap-northeast-2.elb.amazonaws.com"
        ));

        // 허용할 HTTP 메서드
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용할 헤더
        config.setAllowedHeaders(Arrays.asList("*"));

        // 인증 정보 포함 허용
        config.setAllowCredentials(true);

        // preflight 요청 캐시 시간
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
