package com.toft.letsplay.security;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "blacklisted_tokens")
public class BlacklistedToken {

    @Id
    private String id;

    private String token;
    private Date expiryDate;

    public BlacklistedToken() {}

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
