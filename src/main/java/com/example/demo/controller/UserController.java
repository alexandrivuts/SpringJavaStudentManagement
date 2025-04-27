package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.service.StudentService;
import com.example.demo.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final StudentService studentService;

    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService, StudentService studentService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> requestData) {
        try {
            User user = new User();
            user.setUsername((String) requestData.get("username"));
            user.setPassword((String) requestData.get("password"));
            user.setName((String) requestData.get("name"));
            user.setSurname((String) requestData.get("surname"));
            user.setEmail((String) requestData.get("email"));
            user.setBirthday((String) requestData.get("birthday"));
            user.setPhoneNumber((String) requestData.get("phoneNumber"));

            int groupNumber = (Integer) requestData.get("groupNumber");

            userService.insert(user, groupNumber);

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            (String) requestData.get("password")
                    )
            );

            String token = jwtService.generateToken(user.getUsername());
            User savedUser = userService.findByUsername(user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser);
            response.put("groupNumber", groupNumber);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByUsername(loginRequest.getUsername());
            String token = jwtService.generateToken(user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            if (user.getRole().getRoleName().equals("USER")) {
                Student student = studentService.findByUserId(user.getUser_id());
                if (student != null && student.getGroup() != null) {
                    response.put("groupNumber", student.getGroup().getGroupNumber());
                }
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody Map<String, Object> requestData) {
        try {
            User user = userService.findById(id);

            if (requestData.containsKey("name")) {
                user.setName((String) requestData.get("name"));
            }
            if (requestData.containsKey("surname")) {
                user.setSurname((String) requestData.get("surname"));
            }
            if (requestData.containsKey("email")) {
                user.setEmail((String) requestData.get("email"));
            }
            if (requestData.containsKey("phoneNumber")) {
                user.setPhoneNumber((String) requestData.get("phoneNumber"));
            }
            if (requestData.containsKey("birthday")) {
                user.setBirthday((String) requestData.get("birthday"));
            }

            userService.update(user);

            return ResponseEntity.ok("User updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    @PostMapping("/add-student")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminRegisterUser(@RequestBody Map<String, Object> requestData) {
        try {
            User user = new User();
            user.setUsername((String) requestData.get("username"));
            user.setPassword((String) requestData.get("password"));
            user.setName((String) requestData.get("name"));
            user.setSurname((String) requestData.get("surname"));
            user.setEmail((String) requestData.get("email"));
            user.setBirthday((String) requestData.get("birthday"));
            user.setPhoneNumber((String) requestData.get("phoneNumber"));

            int groupNumber = (Integer) requestData.get("groupNumber");

            userService.insert(user, groupNumber);

            User savedUser = userService.findByUsername(user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("user", savedUser);
            response.put("groupNumber", groupNumber);
            response.put("message", "Student was registered!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-student/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable int id) {
        try {
            studentService.delete(id);
            return ResponseEntity.ok()
                    .body("Student with ID " + id + " successfully deleted");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            // Возвращаем более точную ошибку для случая с внешними ключами
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Cannot delete student with ID " + id + " because there are dependent records.");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error while deleting: " + e.getMessage());
        }
    }

}