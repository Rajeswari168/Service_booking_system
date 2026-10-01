package com.homeservice.controller;

import com.homeservice.dto.ApiResponse;
import com.homeservice.entity.Provider;
import com.homeservice.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProviders() {
        List<Provider> providers = providerService.getAllProviders();
        return ResponseEntity.ok(ApiResponse.ok("Providers fetched successfully", providers));
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<ApiResponse> getProvidersByService(@PathVariable Long serviceId) {
        List<Provider> providers = providerService.getProvidersByService(serviceId);
        return ResponseEntity.ok(ApiResponse.ok("Providers for service fetched successfully", providers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProviderById(@PathVariable Long id) {
        Provider provider = providerService.getProviderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Provider fetched successfully", provider));
    }
}
