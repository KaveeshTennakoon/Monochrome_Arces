package com.monochrome.Backend.service;

import com.monochrome.Backend.dto.UserDto;
import com.monochrome.Backend.entity.User;
import com.monochrome.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserDto getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = principal instanceof UserDetails ? ((UserDetails) principal).getUsername() : principal.toString();
        User user = userRepository.findByUsername(username).orElseThrow();
        return authService.toDto(user);
    }
}
