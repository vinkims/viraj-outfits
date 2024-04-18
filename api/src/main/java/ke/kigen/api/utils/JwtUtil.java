package ke.kigen.api.utils;

import org.springframework.stereotype.Component;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.services.auth.blacklist.SBlacklist;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtil {
    
    private final SBlacklist sBlacklist;
    
    private final MainConfig mainConfig;
}
