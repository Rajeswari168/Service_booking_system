package com.homeservice.service;

import com.homeservice.dto.ServiceRequest;
import com.homeservice.entity.Category;
import com.homeservice.entity.ServiceEntity;
import com.homeservice.exception.ResourceNotFoundException;
import com.homeservice.repository.CategoryRepository;
import com.homeservice.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceEntityService {

    private final ServiceRepository serviceRepository;
    private final CategoryRepository categoryRepository;

    public ServiceEntityService(ServiceRepository serviceRepository, CategoryRepository categoryRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ServiceEntity> getAllServices(String search, Long categoryId) {
        if ((search == null || search.trim().isEmpty()) && categoryId == null) {
            return serviceRepository.findAll();
        }
        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return serviceRepository.searchServices(searchTerm, categoryId);
    }

    public ServiceEntity getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id " + id));
    }

    @Transactional
    public ServiceEntity createService(ServiceRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + request.getCategoryId()));

        ServiceEntity service = new ServiceEntity(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                category
        );
        return serviceRepository.save(service);
    }

    @Transactional
    public ServiceEntity updateService(Long id, ServiceRequest request) {
        ServiceEntity service = getServiceById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + request.getCategoryId()));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setCategory(category);
        return serviceRepository.save(service);
    }

    @Transactional
    public void deleteService(Long id) {
        ServiceEntity service = getServiceById(id);
        serviceRepository.delete(service);
    }
}
