package com.nolifers.analytics.service;

import com.nolifers.analytics.model.RecommendationItem;
import com.nolifers.analytics.model.RecommendationResponse;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

  public RecommendationResponse buildRecommendations(String userId) {
    List<RecommendationItem> items = List.of(
        new RecommendationItem(
            "Children of Time",
            "book",
            0.91,
            "High overlap with reflective science fiction, long-form worldbuilding, and systems-driven storytelling."
        ),
        new RecommendationItem(
            "Monster",
            "anime",
            0.88,
            "Strong fit for psychological narratives with mature themes and deliberate pacing."
        ),
        new RecommendationItem(
            "Untrue",
            "album",
            0.85,
            "A good next step for electronic listening sessions with atmosphere and emotional texture."
        )
    );

    return new RecommendationResponse(
        userId,
        Instant.now().toString(),
        "spring-analytics-seed",
        items
    );
  }
}

