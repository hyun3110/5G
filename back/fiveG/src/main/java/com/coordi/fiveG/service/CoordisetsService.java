package com.coordi.fiveG.service;

import com.coordi.fiveG.controller.CoordisetsDTO;
import com.coordi.fiveG.model.Coordisets;
import com.coordi.fiveG.repository.CoordisetsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CoordisetsService {

    private final CoordisetsRepository coordisetsRepository;

    public List<Coordisets> getCoordisets(Long userId) {
        return coordisetsRepository.findByUserId(userId);
    }

    public Coordisets updateCoordiset(CoordisetsDTO dto) {

        Coordisets coordiset = coordisetsRepository.findById(dto.getIdx()).get();
        coordiset.setPick(dto.isPick());

        return coordisetsRepository.save(coordiset);

    }

    public List<Coordisets> getPickCoordisets(Long userId) {
        return coordisetsRepository.findByUserIdAndPick(userId, true);
    }

    public void up(Long userId, String img) {
        Coordisets coordi = new Coordisets();
        coordi.setUserId(userId);
        coordi.setImg(img);
        coordisetsRepository.save(coordi);
    }
}
