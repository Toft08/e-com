package com.toft.letsplay.repository;

import com.toft.letsplay.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Need to figure out what to query

    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
}