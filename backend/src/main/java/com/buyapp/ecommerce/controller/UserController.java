package com.buyapp.ecommerce.controller;

import com.buyapp.common.dto.UserDto;
import com.buyapp.common.exception.ResourceNotFoundException;
import com.buyapp.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController{
    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserDto getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto createUser(@Valid @RequestBody UserDto userDto) {
        return userService.createUser(userDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public UserDto updateUser(@PathVariable String id, @Valid @RequestBody UserDto userDto, Authentication authentication) {
        return  userService.updateUser(id, userDto, authentication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        if (!userService.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id:" + id);
        }
        
        userService.deleteUser(id, userDetails);
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public void deleteCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        UserDto user = userService.getUserByEmail(email);
        userService.deleteUser(user.getId(), userDetails);
    }
}