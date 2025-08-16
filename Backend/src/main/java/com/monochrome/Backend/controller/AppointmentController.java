package com.monochrome.Backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monochrome.Backend.dto.AppointmentCreateRequest;
import com.monochrome.Backend.dto.AppointmentResponse;
import com.monochrome.Backend.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@RequestBody @Valid AppointmentCreateRequest req) {
        return ResponseEntity.ok(appointmentService.create(req));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<AppointmentResponse>> upcoming() {
        return ResponseEntity.ok(appointmentService.upcoming());
    }
}
