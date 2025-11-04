package com.toft.letsplay.security;

import com.toft.letsplay.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class TokenBlacklist {

    @Autowired
    private BlacklistedTokenRepository repository;


    public void blacklistToken(String token, Date expiry) {
        repository.save(new BlacklistedToken(token, expiry));
    }

    public boolean isBlacklisted(String token) {
        return repository.findByToken(token).isPresent();
    }

    public void cleanupExpired() {
        repository.deleteByExpiryDateBefore(new Date());
    }
}
