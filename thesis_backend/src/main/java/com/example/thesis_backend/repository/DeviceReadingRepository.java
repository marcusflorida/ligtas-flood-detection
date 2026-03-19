package com.example.thesis_backend.repository;

import com.example.thesis_backend.model.DeviceReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeviceReadingRepository extends JpaRepository<DeviceReading, Long> {
    List<DeviceReading> findByStatus(String status);
    List<DeviceReading> findByOrderByRecordedAtDesc();
}