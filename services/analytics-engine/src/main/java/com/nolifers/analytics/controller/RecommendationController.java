package com.nolifers.analytics.controller;

import com.nolifers.analytics.model.RecommendationResponse;
import com.nolifers.analytics.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/recommendations")
public class RecommendationController {

  private final RecommendationService recommendationService;

  public RecommendationController(RecommendationService recommendationService) {
    this.recommendationService = recommendationService;
  }

  @GetMapping("/{userId}")
  public RecommendationResponse getRecommendations(@PathVariable String userId) {
    return recommendationService.buildRecommendations(userId);
  }
}

