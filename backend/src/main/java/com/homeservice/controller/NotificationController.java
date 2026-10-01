package com.homeservice.controller;

import com.homeservice.dto.ApiResponse;
import com.homeservice.entity.Notification;
import com.homeservice.exception.BadRequestException;
import com.homeservice.security.UserDetailsImpl;
import com.homeservice.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getNotifications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        List<Notification> notifications = notificationService.getUserNotifications(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications fetched successfully", notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Notification notification = notificationService.markAsRead(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", notification));
    }
}
