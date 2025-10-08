package swp302.topic6.evcoownership.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("EV Co-ownership API is running. Try POST /api/auth/login");
    }

    @RequestMapping({"/api/health", "/health"})
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}


