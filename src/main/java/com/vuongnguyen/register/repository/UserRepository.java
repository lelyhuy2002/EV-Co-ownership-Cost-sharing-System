package com.vuongnguyen.register.repository;

import com.vuongnguyen.register.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);

    // Kiểm tra CCCD đã tồn tại chưa
    boolean existsByCccd(String cccd);

    // Kiểm tra Driver License đã tồn tại chưa
    boolean existsByDriverLicense(String driverLicense);

    // Tìm user theo email
    Optional<User> findByEmail(String email);

    // Tìm user theo CCCD
    Optional<User> findByCccd(String cccd);
}