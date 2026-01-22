package com.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.CreateUserDTO;
import com.project.dto.UserDTO;
import com.project.entities.User;
import com.project.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRespo;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
   
    @Override
    public UserDTO createUser(CreateUserDTO dto) {

        User user = modelMapper.map(dto, User.class);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User savedUser = userRespo.save(user);

        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRespo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return modelMapper.map(user, UserDTO.class);
    }
    
    @Override
    public List<UserDTO> listAllUsers() {

        return userRespo.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, UserDTO.class))
                .toList();
    }

}
