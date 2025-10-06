package com.vuongnguyen.register.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private Integer userId;
    private String fullName;
    private String email;
    private String cccd;
    private String driverLicense;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    private String role;
    private String verificationStatus;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    private String message;

    public RegisterResponse(String message) {
        this.message = message;
    }
}