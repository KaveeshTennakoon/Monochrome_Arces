package com.monochrome.Backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/superadmin/demo")
public class SuperAdminSampleController {

    @GetMapping
    public String superadminOnly() {
        return "SuperAdmin endpoint accessible";
    }
}
