package com.buyapp.common.event;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ProductEvent implements Serializable {

    public enum EventType {
        PRODUCT_CREATED,
        PRODUCT_UPDATED,
        PRODUCT_DELETED
    }

    private EventType eventType;
    private String productId;
    private String productName;
    private String sellerId;
    private String sellerEmail;
    private LocalDateTime timestamp;

    public ProductEvent() {
        this.timestamp = LocalDateTime.now();
    }

    public ProductEvent(EventType eventType, String productId, String sellerId, String sellerEmail) {
        this.eventType = eventType;
        this.productId = productId;
        this.sellerId = sellerId;
        this.sellerEmail = sellerEmail;
        this.timestamp = LocalDateTime.now();
    }

    public ProductEvent(EventType eventType, String productId, String productName, String sellerId, String sellerEmail) {
        this.eventType = eventType;
        this.productId = productId;
        this.productName = productName;
        this.sellerId = sellerId;
        this.sellerEmail = sellerEmail;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerEmail() {
        return sellerEmail;
    }

    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ProductEvent{" +
                "eventType='" + eventType + '\'' +
                ", productId='" + productId + '\'' +
                ", productName='" + productName + '\'' +
                ", sellerId='" + sellerId + '\'' +
                ", sellerEmail='" + sellerEmail + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
