package com.nolifers.analytics.model;

public record RecommendationItem(
    String title,
    String contentType,
    double score,
    String reason
) {
}

