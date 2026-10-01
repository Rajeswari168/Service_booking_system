package com.homeservice.service;

import com.homeservice.entity.Provider;
import com.homeservice.exception.ResourceNotFoundException;
import com.homeservice.repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;

    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public List<Provider> getProvidersByService(Long serviceId) {
        return providerRepository.findByServices_Id(serviceId);
    }

    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id " + id));
    }

    public Provider getProviderByUserId(Long userId) {
        return providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for user id " + userId));
    }
}
