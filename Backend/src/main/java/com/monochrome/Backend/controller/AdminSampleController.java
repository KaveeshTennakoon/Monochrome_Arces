package com.monochrome.Backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/demo")
public class AdminSampleController {

    @GetMapping
    public String adminOnly() {
        return "Admin endpoint accessible";
    }
}
