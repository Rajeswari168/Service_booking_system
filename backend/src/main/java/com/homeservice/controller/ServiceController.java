package com.homeservice.controller;

import com.homeservice.dto.ApiResponse;
import com.homeservice.dto.ServiceRequest;
import com.homeservice.entity.ServiceEntity;
import com.homeservice.service.ServiceEntityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceEntityService serviceEntityService;

    public ServiceController(ServiceEntityService serviceEntityService) {
        this.serviceEntityService = serviceEntityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllServices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        List<ServiceEntity> services = serviceEntityService.getAllServices(search, categoryId);
        return ResponseEntity.ok(ApiResponse.ok("Services fetched successfully", services));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getServiceById(@PathVariable Long id) {
        ServiceEntity service = serviceEntityService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.ok("Service fetched successfully", service));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createService(@Valid @RequestBody ServiceRequest request) {
        ServiceEntity service = serviceEntityService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Service created successfully", service));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateService(@PathVariable Long id, @Valid @RequestBody ServiceRequest request) {
        ServiceEntity service = serviceEntityService.updateService(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Service updated successfully", service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteService(@PathVariable Long id) {
        serviceEntityService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.ok("Service deleted successfully"));
    }
}
