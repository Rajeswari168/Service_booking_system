package com.homeservice.repository;

import com.homeservice.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUserId(Long userId);
    Optional<Provider> findByUserEmail(String email);
    List<Provider> findByServices_Id(Long serviceId);
}
