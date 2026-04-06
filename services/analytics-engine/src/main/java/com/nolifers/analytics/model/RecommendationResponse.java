package com.nolifers.analytics.model;

import java.util.List;

public record RecommendationResponse(
    String userId,
    String generatedAt,
    String source,
    List<RecommendationItem> items
) {
}

