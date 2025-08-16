package com.monochrome.Backend.dto;

import lombok.*;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long id;
    private String name;
    private String username;
    private String email;
    private String role;
    private String department;
    private Set<String> permissions;
    private Instant loginTime;
}
