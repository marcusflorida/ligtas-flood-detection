package com.example.thesis_backend.service;

import com.example.thesis_backend.model.DeviceReading;
import com.example.thesis_backend.repository.DeviceReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DeviceReadingService {

    @Autowired
    private DeviceReadingRepository repository;

    public List<DeviceReading> getAllReadings() {
        return repository.findByOrderByRecordedAtDesc();
    }

    public DeviceReading saveReading(DeviceReading reading) {
        return repository.save(reading);
    }

    public List<DeviceReading> getReadingsByStatus(String status) {
        return repository.findByStatus(status);
    }

    public long getTotalRescued() {
        return repository.findAll()
                .stream()
                .mapToInt(DeviceReading::getRescuedCount)
                .sum();
    }
}