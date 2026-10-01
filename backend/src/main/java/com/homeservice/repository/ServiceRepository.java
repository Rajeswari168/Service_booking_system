package com.homeservice.repository;

import com.homeservice.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    @Query("SELECT s FROM ServiceEntity s WHERE " +
           "(:categoryId IS NULL OR s.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<ServiceEntity> searchServices(@Param("search") String search, @Param("categoryId") Long categoryId);

    List<ServiceEntity> findByCategoryId(Long categoryId);
}
