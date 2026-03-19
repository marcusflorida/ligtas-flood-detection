package com.example.thesis_backend.controller;

import com.example.thesis_backend.model.SmsAlert;
import com.example.thesis_backend.service.SmsAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin(origins = "http://localhost:5173")
public class SmsController {

    @Autowired
    private SmsAlertService service;

    @GetMapping
    public List<Map<String, Object>> getAllAlerts() {
        return service.getAllAlerts().stream()
                .map(alert -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", alert.getId());
                    response.put("recipientName", alert.getRecipientName());
                    response.put("phoneNumber", alert.getMaskedPhoneNumber());  // Masked
                    response.put("location", alert.getLocation());
                    response.put("voltage", alert.getVoltage());
                    response.put("status", alert.getStatus());
                    response.put("sentAt", alert.getSentAt());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public SmsAlert sendAlert(@RequestBody SmsAlert alert) {
        return service.saveAlert(alert);
    }
}