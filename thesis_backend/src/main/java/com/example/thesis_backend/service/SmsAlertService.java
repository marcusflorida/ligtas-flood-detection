package com.example.thesis_backend.service;

import com.example.thesis_backend.model.SmsAlert;
import com.example.thesis_backend.repository.SmsAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SmsAlertService {

    @Autowired
    private SmsAlertRepository repository;

    public List<SmsAlert> getAllAlerts() {
        return repository.findByOrderBySentAtDesc();
    }

    public SmsAlert saveAlert(SmsAlert alert) {
        return repository.save(alert);
    }
}