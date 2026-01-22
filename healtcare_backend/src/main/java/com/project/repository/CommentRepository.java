package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
