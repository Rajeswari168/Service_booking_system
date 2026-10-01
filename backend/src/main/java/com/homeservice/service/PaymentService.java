package com.homeservice.service;

import com.homeservice.dto.PaymentRequest;
import com.homeservice.entity.Booking;
import com.homeservice.entity.Payment;
import com.homeservice.entity.PaymentStatus;
import com.homeservice.exception.BadRequestException;
import com.homeservice.exception.ResourceNotFoundException;
import com.homeservice.repository.BookingRepository;
import com.homeservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          NotificationService notificationService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Payment processPayment(PaymentRequest request, Long customerId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + request.getBookingId()));

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Unauthorized: Booking does not belong to current user");
        }

        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("Payment already completed for booking #" + booking.getId());
        }

        Payment payment = new Payment(booking, request.getAmount(), PaymentStatus.SUCCESS);
        Payment savedPayment = paymentRepository.save(payment);

        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Payment of ₹" + request.getAmount() + " successful for booking #" + booking.getId()
        );

        // Notify provider
        notificationService.createNotification(
                booking.getProvider().getUser(),
                "Payment of ₹" + request.getAmount() + " received for booking #" + booking.getId()
        );

        return savedPayment;
    }

    public Payment getPaymentByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElse(null);
    }
}
