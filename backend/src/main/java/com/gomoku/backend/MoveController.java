package com.gomoku.backend;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")  // 프론트 CORS 허용
@RestController

public class MoveController {

    @PostMapping("/move")
    public Map<String, Object> move(@RequestBody Map<String, Object> body) {
        int row = (int) body.get("row");
        int col = (int) body.get("col");
        String player = (String) body.get("player");

        System.out.println("착수 요청 받음 → " + player + " (" + row + ", " + col + ")");

        return Map.of(
            "ok", true,
            "msg", "착수 처리됨",
            "echo", Map.of("row", row, "col", col, "player", player)
        );
    }
}
