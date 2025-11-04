package com.toft.letsplay.repository;

import com.toft.letsplay.security.BlacklistedToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.Optional;

public interface BlacklistedTokenRepository  extends MongoRepository <BlacklistedToken, String > {
    Optional<BlacklistedToken> findByToken(String token);
    void deleteByExpiryDateBefore(Date date);
}
