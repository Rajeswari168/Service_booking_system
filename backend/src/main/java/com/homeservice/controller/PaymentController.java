package com.homeservice.controller;

import com.homeservice.dto.ApiResponse;
import com.homeservice.dto.PaymentRequest;
import com.homeservice.entity.Payment;
import com.homeservice.exception.BadRequestException;
import com.homeservice.security.UserDetailsImpl;
import com.homeservice.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("User not authenticated");
        }
        Payment payment = paymentService.processPayment(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Payment Successful", payment));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse> getPaymentByBooking(@PathVariable Long bookingId) {
        Payment payment = paymentService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Payment details fetched", payment));
    }
}
