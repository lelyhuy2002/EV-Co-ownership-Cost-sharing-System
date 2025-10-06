package com.vuongnguyen.register.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2-100 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 100, message = "Mật khẩu phải từ 6-100 ký tự")
    private String password;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String confirmPassword;

    @Pattern(regexp = "^[0-9]{9}$|^[0-9]{12}$", message = "CCCD phải có 9 hoặc 12 chữ số")
    private String cccd;

    @Pattern(regexp = "^[0-9A-Z]{12}$", message = "Số giấy phép lái xe không đúng định dạng")
    private String driverLicense;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Pattern(regexp = "^(co_owner|admin)$", message = "Role chỉ có thể là co_owner hoặc admin")
    private String role = "co_owner";
}