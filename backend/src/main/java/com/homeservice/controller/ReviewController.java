package com.homeservice.controller;

import com.homeservice.dto.ApiResponse;
import com.homeservice.dto.ReviewRequest;
import com.homeservice.entity.Review;
import com.homeservice.exception.BadRequestException;
import com.homeservice.security.UserDetailsImpl;
import com.homeservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Review review = reviewService.createReview(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Review submitted successfully", review));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse> getReviewsByProvider(@PathVariable Long providerId) {
        List<Review> reviews = reviewService.getReviewsByProvider(providerId);
        return ResponseEntity.ok(ApiResponse.ok("Reviews fetched successfully", reviews));
    }
}
