package com.vuongnguyen.register.service;
import com.vuongnguyen.register.dto.RegisterRequest;
import com.vuongnguyen.register.dto.RegisterResponse;

public interface UserService {

    RegisterResponse registerUser(RegisterRequest request);

    boolean isEmailExists(String email);

    boolean isCccdExists(String cccd);
}