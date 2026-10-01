package com.homeservice.repository;

import com.homeservice.entity.Booking;
import com.homeservice.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    boolean existsByProviderIdAndBookingDateAndBookingTimeAndStatusNotIn(
        Long providerId,
        LocalDate bookingDate,
        String bookingTime,
        Collection<BookingStatus> excludedStatuses
    );
}
