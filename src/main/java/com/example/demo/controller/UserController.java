package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.service.StudentService;
import com.example.demo.service.UserService;
import org.slf4j.LoggerFactory;
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
import java.util.logging.Logger;

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
            // 1. Создание пользователя
            User user = new User();
            user.setUsername((String) requestData.get("username"));
            user.setPassword((String) requestData.get("password"));
            user.setName((String) requestData.get("name"));
            user.setSurname((String) requestData.get("surname"));
            user.setEmail((String) requestData.get("email"));
            user.setBirthday((String) requestData.get("birthday"));
            user.setPhoneNumber((String) requestData.get("phoneNumber"));

            int groupNumber = (Integer) requestData.get("groupNumber");

            // 2. Регистрация
            userService.insert(user, groupNumber);

            // 3. Авторизация
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            (String) requestData.get("password") // Используем исходный пароль
                    )
            );

            // 4. Генерация токена и получение сохраненного пользователя
            String token = jwtService.generateToken(user.getUsername());
            User savedUser = userService.findByUsername(user.getUsername()); // Получаем из БД

            // 5. Формирование ответа
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser); // Добавляем все данные пользователя
            response.put("groupNumber", groupNumber); // Добавляем группу

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }

    // Остальные методы остаются без изменений
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            // 1. Аутентификация
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 2. Получение данных пользователя
            User user = userService.findByUsername(loginRequest.getUsername());
            String token = jwtService.generateToken(user.getUsername());

            // 3. Формирование базового ответа
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            // 4. Добавляем информацию о группе только для студентов
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

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.userId")
    public ResponseEntity<?> getById(@PathVariable int id) {
        try {
            User user = userService.findById(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.user.userId")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody User user) {
        try {
            User existingUser = userService.findById(id);

            // Обновляем только разрешенные поля
            existingUser.setName(user.getName());
            existingUser.setSurname(user.getSurname());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setBirthday(user.getBirthday());

            userService.update(existingUser);
            return ResponseEntity.ok("User updated");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            userService.delete(id);
            return ResponseEntity.ok("User deleted");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}