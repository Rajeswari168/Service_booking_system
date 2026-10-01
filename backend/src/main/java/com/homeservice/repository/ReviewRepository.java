package com.homeservice.repository;

import com.homeservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProviderIdOrderByCreatedAtDesc(Long providerId);
    boolean existsByBookingId(Long bookingId);
    Optional<Review> findByBookingId(Long bookingId);
}
