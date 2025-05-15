package com.booklog.controller;

import com.booklog.entity.User;
import com.booklog.security.CurrentUser;
import com.booklog.security.UserPrincipal;
import com.booklog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userService.getUserById(currentUser.getId());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        
        User userDetails = new User();
        userDetails.setName(updateUserRequest.getName());
        userDetails.setPhotoUrl(updateUserRequest.getPhotoUrl());
        
        User updatedUser = userService.updateUser(currentUser.getId(), userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/password")
    public ResponseEntity<User> updatePassword(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        
        User updatedUser = userService.updatePassword(
                currentUser.getId(),
                updatePasswordRequest.getCurrentPassword(),
                updatePasswordRequest.getNewPassword()
        );
        
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(@CurrentUser UserPrincipal currentUser) {
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        User user = userService.getUserById(id);
        
        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setPhotoUrl(user.getPhotoUrl());
        
        return ResponseEntity.ok(profile);
    }

    // Request/Response classes
    public static class UpdateUserRequest {
        private String name;
        private String photoUrl;

        // Getters and setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPhotoUrl() {
            return photoUrl;
        }

        public void setPhotoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
        }
    }

    public static class UpdatePasswordRequest {
        @jakarta.validation.constraints.NotBlank(message = "Current password is required")
        private String currentPassword;

        @jakarta.validation.constraints.NotBlank(message = "New password is required")
        @jakarta.validation.constraints.Size(min = 6, message = "Password should be at least 6 characters")
        private String newPassword;

        // Getters and setters
        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class UserProfileResponse {
        private Long id;
        private String name;
        private String photoUrl;

        // Getters and setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPhotoUrl() {
            return photoUrl;
        }

        public void setPhotoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
        }
    }
}
