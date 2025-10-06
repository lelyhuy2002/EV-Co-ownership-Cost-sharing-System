package com.vuongnguyen.register.service;

import com.vuongnguyen.register.dto.RegisterRequest;
import com.vuongnguyen.register.dto.RegisterResponse;
import com.vuongnguyen.register.model.User;
import com.vuongnguyen.register.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public RegisterResponse registerUser(RegisterRequest request) {
        // Validate password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu và xác nhận mật khẩu không khớp");
        }

        // Check email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký");
        }

        // Check CCCD exists (nếu có)
        if (request.getCccd() != null && !request.getCccd().isEmpty()) {
            if (userRepository.existsByCccd(request.getCccd())) {
                throw new RuntimeException("Số CCCD đã được sử dụng");
            }
        }

        // Check Driver License exists (nếu có)
        if (request.getDriverLicense() != null && !request.getDriverLicense().isEmpty()) {
            if (userRepository.existsByDriverLicense(request.getDriverLicense())) {
                throw new RuntimeException("Số giấy phép lái xe đã được sử dụng");
            }
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCccd(request.getCccd());
        user.setDriverLicense(request.getDriverLicense());
        user.setBirthday(request.getBirthday());
        user.setRole(request.getRole() != null ? request.getRole() : "co_owner");
        user.setVerificationStatus("unverified");

        // Save user
        User savedUser = userRepository.save(user);

        // Create response
        RegisterResponse response = new RegisterResponse();
        response.setUserId(savedUser.getUserId());
        response.setFullName(savedUser.getFullName());
        response.setEmail(savedUser.getEmail());
        response.setCccd(savedUser.getCccd());
        response.setDriverLicense(savedUser.getDriverLicense());
        response.setBirthday(savedUser.getBirthday());
        response.setRole(savedUser.getRole());
        response.setVerificationStatus(savedUser.getVerificationStatus());
        response.setCreatedAt(savedUser.getCreatedAt());
        response.setMessage("Đăng ký thành công! Tài khoản đang chờ xác thực.");

        return response;
    }

    @Override
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean isCccdExists(String cccd) {
        return userRepository.existsByCccd(cccd);
    }
}
