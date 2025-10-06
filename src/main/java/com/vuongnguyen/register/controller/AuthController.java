package com.vuongnguyen.register.controller;

import com.vuongnguyen.register.dto.RegisterRequest;
import com.vuongnguyen.register.dto.RegisterResponse;
import com.vuongnguyen.register.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    /**
     * Endpoint đăng ký user mới
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
                                      BindingResult bindingResult) {
        try {
            // Kiểm tra lỗi validation
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(errors);
            }

            // Thực hiện đăng ký
            RegisterResponse response = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Kiểm tra email đã tồn tại chưa
     * GET /api/auth/check-email?email=test@example.com
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.isEmailExists(email);
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("available", !exists);
        response.put("message", exists ? "Email đã được đăng ký" : "Email khả dụng");
        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra CCCD đã tồn tại chưa
     * GET /api/auth/check-cccd?cccd=123456789
     */
    @GetMapping("/check-cccd")
    public ResponseEntity<?> checkCccd(@RequestParam String cccd) {
        boolean exists = userService.isCccdExists(cccd);
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("available", !exists);
        response.put("message", exists ? "Số CCCD đã được sử dụng" : "Số CCCD khả dụng");
        return ResponseEntity.ok(response);
    }
}