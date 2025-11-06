package com.buyapp.common.security;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "blacklisted_tokens")
public class BlacklistedToken {

    @Id
    private String id;

    private String token;
    private Date expiryDate;

    public BlacklistedToken() {
    }

    public BlacklistedToken(String token, Date expiryDate) {
        this.token = token;
        this.expiryDate = expiryDate;
    }

    public String getToken() {
        return token;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }
}