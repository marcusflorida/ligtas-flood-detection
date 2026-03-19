package com.example.thesis_backend.repository;

import com.example.thesis_backend.model.SmsAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SmsAlertRepository extends JpaRepository<SmsAlert, Long> {
    List<SmsAlert> findByOrderBySentAtDesc();
}