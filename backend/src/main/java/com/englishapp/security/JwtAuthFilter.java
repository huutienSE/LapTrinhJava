package com.englishapp.security;

import com.englishapp.entity.User;
import com.englishapp.repositoty.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = authHeader.substring(7);
        
        try {
            String email = jwtUtil.extractEmail(token);

            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null){

                if(!jwtUtil.validateToken(token)){
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                // load user tu DB
                User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, null);

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        catch(Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
