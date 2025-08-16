package com.monochrome.Backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monochrome.Backend.entity.Appointment;
import com.monochrome.Backend.entity.User;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByReferenceId(String referenceId);

    List<Appointment> findByUserAndDateGreaterThanEqualOrderByDateAsc(User user, LocalDate date);
}
