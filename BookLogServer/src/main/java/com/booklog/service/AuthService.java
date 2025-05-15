package com.booklog.service;

import com.booklog.entity.User;
import com.booklog.repository.UserRepository;
import com.booklog.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, 
                       JwtTokenProvider tokenProvider,
                       UserService userService,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public Map<String, Object> login(String email, String password) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = tokenProvider.generateToken(authentication);

        // Update last login time
        User user = userService.getUserByEmail(email);
        updateLastLoginTime(user.getId());

        // Return token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        
        return response;
    }

    @Transactional
    public Map<String, Object> register(User user) {
        // Create new user
        User newUser = userService.createUser(user);

        // Generate token for the new user
        String token = tokenProvider.generateTokenFromUserId(newUser.getId());

        // Return token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", newUser);
        
        return response;
    }

    @Transactional
    public void updateLastLoginTime(Long userId) {
        User user = userService.getUserById(userId);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public Map<String, Object> refreshToken(String token) {
        // Validate token
        if (!tokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }

        // Get user ID from token
        Long userId = tokenProvider.getUserIdFromToken(token);

        // Generate new token
        String newToken = tokenProvider.generateTokenFromUserId(userId);

        // Get user
        User user = userService.getUserById(userId);

        // Return new token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", newToken);
        response.put("user", user);
        
        return response;
    }
}
