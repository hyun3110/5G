package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Clothings;
import com.coordi.fiveG.service.ClothingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/clothings")
public class ClothingsController {

    private final ClothingsService clothingsService;

    @GetMapping("/{id}")
    public List<Clothings> getClothingById(@PathVariable("id") Long id){
        return clothingsService.getClothingById(id);
    };

}
