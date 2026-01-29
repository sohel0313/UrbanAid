package com.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.dto.AuthRequest;
import com.project.dto.AuthResp;
import com.project.dto.CreateUserDTO;
import com.project.dto.UserDTO;
import com.project.entities.User;
import com.project.security.JwtUtils;
import com.project.security.UserPrincipal;
import com.project.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {

    private final UserService userService;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;


    
     //1. List all users
     
     
    @GetMapping
    @Operation(description = "List all users")
    public ResponseEntity<?> listAllUsers() {
        log.info("in list all users");
        List<UserDTO> users = userService.listAllUsers();

        if (users.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

        return ResponseEntity.ok(users);
    }

    /*
     * 2. Get user details by ID
   
     */
    @GetMapping("/{userId}")
    @Operation(description = "Get user details by ID")
    public ResponseEntity<?> getUserDetails(
            @PathVariable 
            @Min(1) 
            @Max(100000) 
            Long userId) {

        log.info("in get user details {}", userId);
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    /*
     * 3. Register User
     
     */
    @PostMapping("/register")
    @Operation(description = "Register a new user")
    public ResponseEntity<?> registerUser(
            @RequestBody @Valid CreateUserDTO dto) {

        log.info("registering user {}", dto.getEmail());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(dto));
    }

    /*
     * 4. Complete update user details
     
     */
    @PutMapping("/{id}")
    @Operation(description = "Complete update user details")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable Long id,
            @RequestBody User user) {

        log.info("updating user {} ", id);
        // OPTIONAL: add update method in service later
        return ResponseEntity.ok("User updated successfully");
    }

    /*
     * 5. User Sign-In (Placeholder)
    
     */
    @PostMapping("/signin")
	@Operation(description = "User Authentication With Spring Security")
	public ResponseEntity<?> userSignIn(@RequestBody @Valid  AuthRequest request) {
		log.info("in user sign in {} ",request);		
		/*1. Create Authentication object (UsernamePasswordAuthToken) 
		 * to store - email & password
		 */
		Authentication holder=new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
		log.info("*****Before -  is authenticated {}",holder.isAuthenticated());//false
		/*
		 * Call AuthenticationMgr's authenticate method
		 */
		 Authentication fullyAuth = authenticationManager.authenticate(holder);
		//=> authentication success -> create JWT 
		log.info("*****After -  is authenticated {}",fullyAuth.isAuthenticated());//true
		log.info("**** auth {} ",fullyAuth);//principal : user details , null : pwd , Collection<GrantedAuth>		
		log.info("***** class of principal {}",fullyAuth.getPrincipal().getClass());//com.project.security.UserPrincipal implemented UserDetails interface
		//downcast Object -> UserPrincipal
		UserPrincipal principal=(UserPrincipal) fullyAuth.getPrincipal();
			return ResponseEntity.status(HttpStatus.CREATED) //SC 201
					.body(new AuthResp(jwtUtils.generateToken(principal)," ","Successful Login",1l));		
	}


    /*
     * 6. Encrypt passwords (Admin Utility)
     
     */
    @PatchMapping("/pwd-encryption")
    @Operation(description = "Encrypt passwords of all users")
    public ResponseEntity<?> encryptPasswords() {

        log.info("encrypting user passwords");
        // implement later in service if needed
        return ResponseEntity.ok("Passwords encrypted successfully");
    }
}
