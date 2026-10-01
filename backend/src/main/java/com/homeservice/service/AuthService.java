package com.homeservice.service;

import com.homeservice.dto.AuthRequest;
import com.homeservice.dto.AuthResponse;
import com.homeservice.dto.RegisterRequest;
import com.homeservice.entity.Provider;
import com.homeservice.entity.Role;
import com.homeservice.entity.User;
import com.homeservice.exception.BadRequestException;
import com.homeservice.repository.ProviderRepository;
import com.homeservice.repository.UserRepository;
import com.homeservice.security.JwtUtils;
import com.homeservice.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       ProviderRepository providerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name(), user.getId());

        Long providerId = null;
        if (user.getRole() == Role.PROVIDER) {
            providerId = providerRepository.findByUserId(user.getId())
                    .map(Provider::getId)
                    .orElse(null);
        }

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), providerId);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                request.getRole()
        );

        User savedUser = userRepository.save(user);
        Long providerId = null;

        if (savedUser.getRole() == Role.PROVIDER) {
            Provider provider = new Provider(
                    savedUser,
                    request.getExperience() != null ? request.getExperience() : "1 year",
                    request.getBio() != null ? request.getBio() : "Professional service provider"
            );
            Provider savedProvider = providerRepository.save(provider);
            providerId = savedProvider.getId();
        }

        String token = jwtUtils.generateJwtToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), providerId);
    }
}
