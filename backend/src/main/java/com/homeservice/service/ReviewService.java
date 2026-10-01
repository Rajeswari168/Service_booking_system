package com.homeservice.service;

import com.homeservice.dto.ReviewRequest;
import com.homeservice.entity.Booking;
import com.homeservice.entity.BookingStatus;
import com.homeservice.entity.Review;
import com.homeservice.exception.BadRequestException;
import com.homeservice.exception.ResourceNotFoundException;
import com.homeservice.repository.BookingRepository;
import com.homeservice.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    public List<Review> getReviewsByProvider(Long providerId) {
        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    @Transactional
    public Review createReview(ReviewRequest request, Long customerId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + request.getBookingId()));

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Unauthorized: Booking does not belong to current user");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Only completed bookings can be reviewed");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("One review per booking is permitted");
        }

        Review review = new Review(
                booking,
                booking.getCustomer(),
                booking.getProvider(),
                request.getRating(),
                request.getComment()
        );

        Review savedReview = reviewRepository.save(review);

        // Notify provider
        notificationService.createNotification(
                booking.getProvider().getUser(),
                "New " + request.getRating() + "-star review received from " + booking.getCustomer().getName() + " for booking #" + booking.getId()
        );

        return savedReview;
    }
}
