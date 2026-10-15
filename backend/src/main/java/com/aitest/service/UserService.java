package com.aitest.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aitest.dto.LoginRequest;
import com.aitest.dto.LoginResponse;
import com.aitest.dto.UserRegistrationRequest;
import com.aitest.entity.User;
import com.aitest.exception.EmailAlreadyExistsException;
import com.aitest.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(UserRegistrationRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        return repository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = repository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String demoJwtToken = "eyAiYWxnIjogIkhTMjU2IiwgInR5cCI6ICJKV1QiIH0." +
                System.currentTimeMillis() + "." + user.getId();

        return new LoginResponse(demoJwtToken, user.getName(), user.getEmail(), user.getRole());
    }
}
