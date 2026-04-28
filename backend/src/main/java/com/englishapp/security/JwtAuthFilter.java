package com.englishapp.security;

import com.englishapp.entity.User;
import com.englishapp.exception.InvalidTokenException;
import com.englishapp.repositoty.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {
            if (!jwtUtil.validateToken(token)) {
                throw new InvalidTokenException();
            }

            final String email = jwtUtil.extractEmail(token);
            final String role = jwtUtil.extractRole(token);

            if (email == null || role == null) {
                throw new InvalidTokenException();
            }

            var currentAuth = SecurityContextHolder.getContext().getAuthentication();

            boolean isAnonymousPrincipal = false;
            if (currentAuth != null) {
                Object principal = currentAuth.getPrincipal();
                isAnonymousPrincipal = (principal instanceof String && "anonymousUser".equals(principal))
                        || currentAuth instanceof AnonymousAuthenticationToken;
            }

            if (currentAuth == null || isAnonymousPrincipal) {

                User user = userRepository.findByEmail(email)
                        .orElseThrow(InvalidTokenException::new);

                UserPrincipal userPrincipal = UserPrincipal.fromUser(user, role);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userPrincipal, null, userPrincipal.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);

                log.info("Authentication set from JWT for user: {}, roles: {}", userPrincipal.getUsername(), userPrincipal.getAuthorities());
            } else {
                log.debug("Existing non-anonymous authentication present, not overriding: {}", currentAuth);
            }

            filterChain.doFilter(request, response);

        } catch (InvalidTokenException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
            handleUnauthorized(response, "Invalid or expired token");
        } catch (Exception e) {
            log.error("Authentication filter error", e);
            handleUnauthorized(response, "Authentication failed");
        }
    }

    private void handleUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json; charset=UTF-8");

        String jsonResponse = String.format("""
                {
                    "success": false,
                    "data": null,
                    "message": "%s"
                }
                """, message);

        response.getWriter().write(jsonResponse);
    }
}
