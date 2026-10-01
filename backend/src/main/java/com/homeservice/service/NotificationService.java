package com.homeservice.service;

import com.homeservice.entity.Notification;
import com.homeservice.entity.User;
import com.homeservice.exception.BadRequestException;
import com.homeservice.exception.ResourceNotFoundException;
import com.homeservice.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to notification");
        }

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification createNotification(User user, String message) {
        Notification notification = new Notification(user, message);
        return notificationRepository.save(notification);
    }
}
