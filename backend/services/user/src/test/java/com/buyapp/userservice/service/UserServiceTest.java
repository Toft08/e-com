package com.buyapp.userservice.service;

import com.buyapp.common.dto.UserDto;
import com.buyapp.common.exception.BadRequestException;
import com.buyapp.common.exception.ResourceNotFoundException;
import com.buyapp.userservice.model.User;
import com.buyapp.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private UserEventProducer userEventProducer;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserDto testUserDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setName("testuser");
        testUser.setPassword("encodedPassword");
        testUser.setRole("client");

        testUserDto = new UserDto();
        testUserDto.setId("1");
        testUserDto.setEmail("test@example.com");
        testUserDto.setName("testuser");
        testUserDto.setPassword("password123");
        testUserDto.setRole("client");
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<UserDto> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getEmail(), result.get(0).getEmail());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

        // Act
        UserDto result = userService.getUserById("1");

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findById("1");
    }

    @Test
    void getUserById_WhenUserDoesNotExist_ShouldThrowException() {
        // Arrange
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById("999");
        });
        verify(userRepository, times(1)).findById("999");
    }

    @Test
    void existsById_WhenUserExists_ShouldReturnTrue() {
        // Arrange
        when(userRepository.existsById("1")).thenReturn(true);

        // Act
        boolean result = userService.existsById("1");

        // Assert
        assertTrue(result);
        verify(userRepository, times(1)).existsById("1");
    }

    @Test
    void existsById_WhenUserDoesNotExist_ShouldReturnFalse() {
        // Arrange
        when(userRepository.existsById("999")).thenReturn(false);

        // Act
        boolean result = userService.existsById("999");

        // Assert
        assertFalse(result);
        verify(userRepository, times(1)).existsById("999");
    }

    @Test
    void getUserByEmail_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        UserDto result = userService.getUserByEmail("test@example.com");

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void getUserByEmail_WhenUserDoesNotExist_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserByEmail("nonexistent@example.com");
        });
    }

    @Test
    void createUser_WithValidData_ShouldCreateUser() {
        // Arrange
        when(userRepository.findByEmail(testUserDto.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        UserDto result = userService.createUser(testUserDto);

        // Assert
        assertNotNull(result);
        assertEquals(testUserDto.getEmail(), result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode(testUserDto.getPassword());
    }

    @Test
    void createUser_WithExistingEmail_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail(testUserDto.getEmail())).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(BadRequestException.class, () -> {
            userService.createUser(testUserDto);
        });
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_ShouldEncodePassword() {
        // Arrange
        String rawPassword = "password123";
        testUserDto.setPassword(rawPassword);
        when(userRepository.findByEmail(testUserDto.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(rawPassword)).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.createUser(testUserDto);

        // Assert
        verify(passwordEncoder, times(1)).encode(rawPassword);
    }
}
