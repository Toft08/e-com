package com.buyapp.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.buyapp.userservice", "com.buyapp.common" })
@EnableMongoRepositories(basePackages = { "com.buyapp.userservice.repository", "com.buyapp.common.repository" })
public class UserServiceApplication {

    // INTENTIONAL ERROR FOR TESTING - This will break the build!
    THIS_IS_A_SYNTAX_ERROR

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}