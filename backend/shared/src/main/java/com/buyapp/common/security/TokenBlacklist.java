package com.buyapp.common.security;

import com.buyapp.common.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

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