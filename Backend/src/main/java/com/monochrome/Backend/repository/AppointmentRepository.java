package com.monochrome.Backend.repository;

import com.monochrome.Backend.entity.Appointment;
import com.monochrome.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Optional<Appointment> findByReferenceId(String referenceId);
    List<Appointment> findByUserAndDateGreaterThanEqualOrderByDateAsc(User user, LocalDate date);
}
