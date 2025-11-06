package com.buyapp.common.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.buyapp.common.security.BlacklistedToken;

public interface BlacklistedTokenRepository extends MongoRepository<BlacklistedToken, String> {
    Optional<BlacklistedToken> findByToken(String token);

    void deleteByExpiryDateBefore(Date date);
}