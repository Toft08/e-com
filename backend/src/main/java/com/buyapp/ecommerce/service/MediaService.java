package com.buyapp.ecommerce.service;

import com.buyapp.common.exception.BadRequestException;
import com.buyapp.common.exception.ResourceNotFoundException;
import com.buyapp.ecommerce.model.Media;
import com.buyapp.ecommerce.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    private static final String UPLOAD_DIR = "uploads/images/";
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    private static final String[] ALLOWED_CONTENT_TYPES = {
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    };

    public MediaService() {
        // Create upload directory if it doesn't exist
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public Media uploadMedia(MultipartFile file, String productId) {
        validateFile(file);
        
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Save file to disk
            Path targetLocation = Paths.get(UPLOAD_DIR + uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Create media entity
            Media media = new Media();
            media.setImagePath(UPLOAD_DIR + uniqueFilename);
            media.setProductId(productId);
            media.setFileName(originalFilename);
            media.setContentType(file.getContentType());
            media.setFileSize(file.getSize());
            
            return mediaRepository.save(media);
        } catch (IOException e) {
            throw new BadRequestException("Could not store file: " + e.getMessage());
        }
    }

    public List<Media> getMediaByProductId(String productId) {
        return mediaRepository.findByProductId(productId);
    }

    public Media getMediaById(String id) {
        return mediaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + id));
    }

    @Transactional
    public void deleteMedia(String id) {
        Media media = getMediaById(id);
        
        // Delete file from disk
        try {
            Path filePath = Paths.get(media.getImagePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't fail the transaction
            System.err.println("Could not delete file: " + media.getImagePath() + " - " + e.getMessage());
        }
        
        // Delete from database
        mediaRepository.deleteById(id);
    }

    @Transactional
    public void deleteMediaByProductId(String productId) {
        List<Media> mediaList = getMediaByProductId(productId);
        
        // Delete files from disk
        for (Media media : mediaList) {
            try {
                Path filePath = Paths.get(media.getImagePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Could not delete file: " + media.getImagePath() + " - " + e.getMessage());
            }
        }
        
        // Delete from database
        mediaRepository.deleteByProductId(productId);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum limit of 2MB");
        }
        
        String contentType = file.getContentType();
        boolean isValidType = false;
        for (String allowedType : ALLOWED_CONTENT_TYPES) {
            if (allowedType.equals(contentType)) {
                isValidType = true;
                break;
            }
        }
        
        if (!isValidType) {
            throw new BadRequestException("Invalid file type. Only image files (JPEG, PNG, GIF, WebP) are allowed");
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new BadRequestException("Invalid filename");
        }
    }
}