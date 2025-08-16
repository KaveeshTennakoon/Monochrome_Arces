package com.monochrome.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monochrome.Backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByNic(String nic);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByNic(String nic);
}
