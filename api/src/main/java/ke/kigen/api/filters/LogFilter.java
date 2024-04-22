package ke.kigen.api.filters;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class LogFilter extends OncePerRequestFilter {

    private final MainConfig mainConfig;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } catch (Exception e) {
            logRequestResponse(requestWrapper, responseWrapper);
            responseWrapper.copyBodyToResponse();
        }
    }

    /**
     * Logs requests and/or responses
     * 
     * @param requestWrapper
     * @param responseWrapper
     * @throws UnsupportedEncodingException
     */
    public void logRequestResponse(ContentCachingRequestWrapper requestWrapper, 
            ContentCachingResponseWrapper responseWrapper) throws UnsupportedEncodingException {

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
