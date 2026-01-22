package com.project.service;

import java.util.List;

import com.project.dto.CreateUserDTO;
import com.project.dto.UserDTO;

public interface UserService {

    UserDTO createUser(CreateUserDTO dto);

    UserDTO getUserById(Long id);
    
    List<UserDTO> listAllUsers();

}
