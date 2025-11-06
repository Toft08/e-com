package com.buyapp.ecommerce.controller;

import com.buyapp.common.exception.ForbiddenException;
import com.buyapp.common.exception.ResourceNotFoundException;
import com.buyapp.ecommerce.model.Media;
import com.buyapp.ecommerce.model.Product;
import com.buyapp.ecommerce.service.MediaService;
import com.buyapp.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @Autowired
    private ProductService productService;

    @PostMapping("/upload/{productId}")
    public ResponseEntity<Media> uploadMedia(
            @PathVariable String productId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Verify the product exists and user owns it
        Product product = productService.getProductEntityById(productId);
        if (!product.getUserId().equals(userDetails.getUsername()) && 
            !userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ForbiddenException("You can only upload media for your own products");
        }
        
        Media savedMedia = mediaService.uploadMedia(file, productId);
        return ResponseEntity.ok(savedMedia);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Media>> getMediaByProduct(@PathVariable String productId) {
        List<Media> mediaList = mediaService.getMediaByProductId(productId);
        return ResponseEntity.ok(mediaList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Media> getMediaById(@PathVariable String id) {
        Media media = mediaService.getMediaById(id);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> getMediaFile(@PathVariable String id) {
        try {
            Media media = mediaService.getMediaById(id);
            Path filePath = Paths.get(media.getImagePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getFileName() + "\"")
                    .body(resource);
            } else {
                throw new ResourceNotFoundException("File not found: " + media.getFileName());
            }
        } catch (IOException e) {
            throw new ResourceNotFoundException("File not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMedia(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Verify user owns the product that this media belongs to
        Media media = mediaService.getMediaById(id);
        Product product = productService.getProductEntityById(media.getProductId());
        
        if (!product.getUserId().equals(userDetails.getUsername()) && 
            !userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ForbiddenException("You can only delete media for your own products");
        }
        
        mediaService.deleteMedia(id);
        return ResponseEntity.ok(Map.of("message", "Media deleted successfully"));
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Map<String, String>> deleteMediaByProduct(
            @PathVariable String productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Verify user owns the product
        Product product = productService.getProductEntityById(productId);
        if (!product.getUserId().equals(userDetails.getUsername()) && 
            !userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ForbiddenException("You can only delete media for your own products");
        }
        
        mediaService.deleteMediaByProductId(productId);
        return ResponseEntity.ok(Map.of("message", "All media for product deleted successfully"));
    }
}