package ke.kigen.api.filters;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.configs.properties.logging.LoggingConfig;
import ke.kigen.api.services.auth.IUserDetails;
import ke.kigen.api.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final IUserDetails sUserDetails;

    private final JwtUtil jwtUtil;

    private final MainConfig mainConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        String userValue = null;
        String jwt = null;

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
                userValue = jwtUtil.extractUsername(jwt);
            }

            // Remove authentication info for each request
            SecurityContextHolder.getContext().setAuthentication(null);

            if (userValue != null) {
                UserDetails userDetails = sUserDetails.loadUserByUsername(userValue);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                    authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        } catch (Exception e) {
            log.error("\n[LOCATION]- JwtFilter.doFilterInternal\n[CLASS]{}\n[MSG]{}", e.getClass(), e.getLocalizedMessage());
        }

        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            logRequestResponse(requestWrapper, responseWrapper);
            responseWrapper.copyBodyToResponse();
        }
    }

    /**
     * Logs requests and/or responses
     * @param requestWrapper
     * @param responseWrapper
     * @throws UnsupportedEncodingException
     */
    public void logRequestResponse(ContentCachingRequestWrapper requestWrapper, ContentCachingResponseWrapper responseWrapper) 
            throws UnsupportedEncodingException {

        LoggingConfig loggingConfig = mainConfig.getLogging();

        String method = requestWrapper.getMethod();

        Boolean logRequest = loggingConfig.getLogRequest();
        Boolean logResponse = loggingConfig.getLogResponse();
        List<String> allowedMethods = loggingConfig.getAllowedMethods();

        if (logRequest && allowedMethods.contains(method)) {
            byte[] requestArray = requestWrapper.getContentAsByteArray();
            String requestStr = new String(requestArray, requestWrapper.getCharacterEncoding());
            log.info("\n[REQUEST]\n[ENDPOINT] - {} {}\n[PAYLOAD] - {}", 
                requestWrapper.getRequestURI(), 
                requestWrapper.getMethod(), requestStr);
        }

        if (logResponse && allowedMethods.contains(method)) {
            byte[] responseArray = responseWrapper.getContentAsByteArray();
            String responseStr = new String(responseArray, responseWrapper.getCharacterEncoding());
            log.info("\n[RESPONSE]\n[PAYLOAD] - {}", responseStr);
        }
    }
    
}
