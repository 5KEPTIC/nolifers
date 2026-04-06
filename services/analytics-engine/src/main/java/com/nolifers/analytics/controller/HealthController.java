package com.nolifers.analytics.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/health")
public class HealthController {

  @GetMapping
  public Map<String, String> health() {
    return Map.of(
        "service", "analytics-engine",
        "status", "ok");
  }
}

