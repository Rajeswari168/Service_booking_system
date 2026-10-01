package com.homeservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;

    @Column(length = 50)
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "provider_services",
        joinColumns = @JoinColumn(name = "provider_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<ServiceEntity> services = new HashSet<>();

    public Provider() {
    }

    public Provider(User user, String experience, String bio) {
        this.user = user;
        this.experience = experience;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Set<ServiceEntity> getServices() {
        return services;
    }

    public void setServices(Set<ServiceEntity> services) {
        this.services = services;
    }
}
