package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.TaskHistory;

public interface TaskHistoryRepository extends JpaRepository<TaskHistory,Long> {

}
