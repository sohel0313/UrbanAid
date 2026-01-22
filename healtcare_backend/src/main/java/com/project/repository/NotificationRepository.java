package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
