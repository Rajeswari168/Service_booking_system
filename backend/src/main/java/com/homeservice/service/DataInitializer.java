package com.homeservice.service;

import com.homeservice.entity.*;
import com.homeservice.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProviderRepository providerRepository,
                           CategoryRepository categoryRepository,
                           ServiceRepository serviceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure default accounts exist with properly encoded demo password "password123"
        initDemoUsersAndData();
    }

    private void initDemoUsersAndData() {
        String defaultPassword = passwordEncoder.encode("password123");

        // 1. Customer
        if (!userRepository.existsByEmail("customer@test.com")) {
            userRepository.save(new User("John Customer", "customer@test.com", defaultPassword, "9876543210", Role.CUSTOMER));
        } else {
            userRepository.findByEmail("customer@test.com").ifPresent(u -> {
                u.setPassword(defaultPassword);
                userRepository.save(u);
            });
        }

        // 2. Admin
        if (!userRepository.existsByEmail("admin@test.com")) {
            userRepository.save(new User("Admin User", "admin@test.com", defaultPassword, "9876543212", Role.ADMIN));
        } else {
            userRepository.findByEmail("admin@test.com").ifPresent(u -> {
                u.setPassword(defaultPassword);
                userRepository.save(u);
            });
        }

        // 3. Categories
        Category plumbing = categoryRepository.findByNameIgnoreCase("Plumbing")
                .orElseGet(() -> categoryRepository.save(new Category("Plumbing", "Plumbing services including tap repairs, pipe leakages, and bathroom fixtures.")));

        Category electrical = categoryRepository.findByNameIgnoreCase("Electrical")
                .orElseGet(() -> categoryRepository.save(new Category("Electrical", "Electrical maintenance including fan installation, switches, and wiring issues.")));

        Category homeChef = categoryRepository.findByNameIgnoreCase("Home Chef")
                .orElseGet(() -> categoryRepository.save(new Category("Home Chef", "Personal cooking and culinary services for daily meals and special occasions.")));

        // 4. Services
        ServiceEntity tapRepair = getOrCreateService("Tap Repair", "Fix leaking, dripping, or damaged taps and faucets in bathroom and kitchen.", 299.0, plumbing);
        ServiceEntity pipeRepair = getOrCreateService("Pipe Repair", "Locate and fix leaking or burst pipes, drainage issues, and joints.", 499.0, plumbing);
        ServiceEntity bathroomRepair = getOrCreateService("Bathroom Repair", "Comprehensive bathroom plumbing inspection, flush tank repair, and fixture fixes.", 799.0, plumbing);

        ServiceEntity fanInstall = getOrCreateService("Fan Installation", "Installation, uninstallation, or speed regulation repair for ceiling and exhaust fans.", 349.0, electrical);
        ServiceEntity switchRepair = getOrCreateService("Switch Repair", "Repair or replacement of burnt, sparking, or loose electrical switches and sockets.", 199.0, electrical);
        ServiceEntity wiringRepair = getOrCreateService("Wiring Repair", "Diagnosis and resolution of circuit trips, short circuits, and damaged wiring lines.", 599.0, electrical);

        ServiceEntity dailyCooking = getOrCreateService("Daily Cooking", "Freshly prepared nutritious breakfast, lunch, or dinner for your entire family.", 699.0, homeChef);
        ServiceEntity partyCooking = getOrCreateService("Party Cooking", "Custom multi-course food preparation for parties, family gatherings, and events.", 1499.0, homeChef);
        ServiceEntity mealPrep = getOrCreateService("Meal Preparation", "Scheduled weekly or daily fitness-oriented healthy meal prep with portion control.", 499.0, homeChef);

        // 5. Providers
        getOrCreateProvider("Kumar", "provider@test.com", "9876543211", "5 years",
                "Certified plumber with 5+ years of experience in residential fittings and tap repairs.",
                defaultPassword, Set.of(tapRepair, pipeRepair, bathroomRepair));

        getOrCreateProvider("Ravi", "ravi@test.com", "9876543213", "4 years",
                "Licensed electrician skilled in house wiring, switch installations, and fan repair.",
                defaultPassword, Set.of(fanInstall, switchRepair, wiringRepair));

        getOrCreateProvider("Arjun", "arjun@test.com", "9876543214", "6 years",
                "Passionate home chef specializing in authentic North and South Indian home-style cooking.",
                defaultPassword, Set.of(dailyCooking, partyCooking, mealPrep));

        getOrCreateProvider("Suresh", "suresh@test.com", "9876543215", "8 years",
                "Senior plumbing technician specialized in bathroom renovation and major pipe leak fixes.",
                defaultPassword, Set.of(tapRepair, pipeRepair, bathroomRepair));

        getOrCreateProvider("Priya", "priya@test.com", "9876543216", "5 years",
                "Professional culinary chef specialized in party dishes and balanced healthy meal preparation.",
                defaultPassword, Set.of(dailyCooking, partyCooking, mealPrep));
    }

    private ServiceEntity getOrCreateService(String name, String desc, Double price, Category category) {
        List<ServiceEntity> list = serviceRepository.searchServices(name, category.getId());
        for (ServiceEntity s : list) {
            if (s.getName().equalsIgnoreCase(name)) {
                return s;
            }
        }
        return serviceRepository.save(new ServiceEntity(name, desc, price, category));
    }

    private void getOrCreateProvider(String name, String email, String phone, String exp, String bio, String pass, Set<ServiceEntity> services) {
        User user = userRepository.findByEmail(email).orElseGet(() ->
                userRepository.save(new User(name, email, pass, phone, Role.PROVIDER)));
        user.setPassword(pass);
        userRepository.save(user);

        Provider provider = providerRepository.findByUserId(user.getId()).orElseGet(() ->
                new Provider(user, exp, bio));
        provider.setExperience(exp);
        provider.setBio(bio);
        provider.setServices(new HashSet<>(services));
        providerRepository.save(provider);
    }
}
