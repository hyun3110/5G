package com.coordi.fiveG.service;

import com.coordi.fiveG.model.Clothings;
import com.coordi.fiveG.repository.ClothingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ClothingsService {

    private final ClothingsRepository clothingsRepository;

    public List<Clothings> getClothingById(Long id) {
        return clothingsRepository.findByUserId(id);
    };

}
