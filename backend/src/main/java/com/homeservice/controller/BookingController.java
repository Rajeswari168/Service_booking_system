package com.homeservice.controller;

import com.homeservice.dto.ApiResponse;
import com.homeservice.dto.BookingRequest;
import com.homeservice.entity.Booking;
import com.homeservice.entity.User;
import com.homeservice.exception.BadRequestException;
import com.homeservice.repository.UserRepository;
import com.homeservice.security.UserDetailsImpl;
import com.homeservice.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        User customer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        Booking booking = bookingService.createBooking(request, customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Booking created successfully", booking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking fetched successfully", booking));
    }

    @GetMapping("/customer")
    public ResponseEntity<ApiResponse> getCustomerBookings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        List<Booking> bookings = bookingService.getCustomerBookings(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Customer bookings fetched successfully", bookings));
    }

    @GetMapping("/provider")
    public ResponseEntity<ApiResponse> getProviderBookings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        List<Booking> bookings = bookingService.getProviderBookings(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Provider bookings fetched successfully", bookings));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.ok("All bookings fetched successfully", bookings));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse> acceptBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Booking booking = bookingService.acceptBooking(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking accepted successfully", booking));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Booking booking = bookingService.rejectBooking(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking rejected successfully", booking));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse> completeBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Booking booking = bookingService.completeBooking(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking completed successfully", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Booking booking = bookingService.cancelBooking(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", booking));
    }
}
