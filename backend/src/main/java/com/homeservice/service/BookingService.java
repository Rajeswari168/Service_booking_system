package com.homeservice.service;

import com.homeservice.dto.BookingRequest;
import com.homeservice.entity.*;
import com.homeservice.exception.BadRequestException;
import com.homeservice.exception.ResourceNotFoundException;
import com.homeservice.repository.BookingRepository;
import com.homeservice.repository.ProviderRepository;
import com.homeservice.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class BookingService {

    public static final List<String> VALID_TIME_SLOTS = Arrays.asList(
            "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"
    );

    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          ProviderRepository providerRepository,
                          ServiceRepository serviceRepository,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
        this.notificationService = notificationService;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getProviderBookings(Long providerUserId) {
        Provider provider = providerRepository.findByUserId(providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found for user id " + providerUserId));
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId());
    }

    @Transactional
    public Booking createBooking(BookingRequest request, User customer) {
        // 1. Validate time slot
        if (!VALID_TIME_SLOTS.contains(request.getBookingTime())) {
            throw new BadRequestException("Invalid time slot. Allowed slots: " + String.join(", ", VALID_TIME_SLOTS));
        }

        // 2. Fetch service & provider
        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id " + request.getServiceId()));

        Provider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id " + request.getProviderId()));

        // 3. Check double booking for provider + date + time
        boolean isSlotTaken = bookingRepository.existsByProviderIdAndBookingDateAndBookingTimeAndStatusNotIn(
                provider.getId(),
                request.getBookingDate(),
                request.getBookingTime(),
                Arrays.asList(BookingStatus.REJECTED, BookingStatus.CANCELLED)
        );

        if (isSlotTaken) {
            throw new BadRequestException("Slot already booked");
        }

        // 4. Save booking
        Booking booking = new Booking(
                customer,
                provider,
                service,
                request.getBookingDate(),
                request.getBookingTime(),
                BookingStatus.PENDING
        );

        Booking savedBooking = bookingRepository.save(booking);

        // 5. Notify provider
        notificationService.createNotification(
                provider.getUser(),
                "New booking #" + savedBooking.getId() + " received for " + service.getName() + " on " +
                        savedBooking.getBookingDate() + " at " + savedBooking.getBookingTime() + " from " + customer.getName()
        );

        return savedBooking;
    }

    @Transactional
    public Booking acceptBooking(Long bookingId, Long providerUserId) {
        Booking booking = getBookingById(bookingId);

        if (!booking.getProvider().getUser().getId().equals(providerUserId)) {
            throw new BadRequestException("Only assigned provider can accept booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking cannot be accepted from status " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        Booking updatedBooking = bookingRepository.save(booking);

        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Your booking #" + booking.getId() + " for " + booking.getService().getName() +
                        " has been ACCEPTED by " + booking.getProvider().getUser().getName()
        );

        return updatedBooking;
    }

    @Transactional
    public Booking rejectBooking(Long bookingId, Long providerUserId) {
        Booking booking = getBookingById(bookingId);

        if (!booking.getProvider().getUser().getId().equals(providerUserId)) {
            throw new BadRequestException("Only assigned provider can reject booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking cannot be rejected from status " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.REJECTED);
        Booking updatedBooking = bookingRepository.save(booking);

        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Your booking #" + booking.getId() + " for " + booking.getService().getName() +
                        " was REJECTED by " + booking.getProvider().getUser().getName()
        );

        return updatedBooking;
    }

    @Transactional
    public Booking completeBooking(Long bookingId, Long providerUserId) {
        Booking booking = getBookingById(bookingId);

        if (!booking.getProvider().getUser().getId().equals(providerUserId)) {
            throw new BadRequestException("Only assigned provider can complete booking");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new BadRequestException("Only accepted bookings can be marked as completed");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        Booking updatedBooking = bookingRepository.save(booking);

        // Notify customer
        notificationService.createNotification(
                booking.getCustomer(),
                "Your booking #" + booking.getId() + " for " + booking.getService().getName() +
                        " is COMPLETED! Please rate your experience."
        );

        return updatedBooking;
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, Long customerUserId) {
        Booking booking = getBookingById(bookingId);

        if (!booking.getCustomer().getId().equals(customerUserId)) {
            throw new BadRequestException("Only booking customer can cancel");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED ||
            booking.getStatus() == BookingStatus.REJECTED ||
            booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel booking with status " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        // Notify provider
        notificationService.createNotification(
                booking.getProvider().getUser(),
                "Booking #" + booking.getId() + " for " + booking.getService().getName() +
                        " was CANCELLED by customer " + booking.getCustomer().getName()
        );

        return updatedBooking;
    }
}
