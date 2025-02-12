package com.coordi.fiveG.service;

import com.coordi.fiveG.model.Fake;
import com.coordi.fiveG.repository.FakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class FakeService {

    private final FakeRepository fakeRepository;

    public Fake fake(Long id) {
        return fakeRepository.findById(id).get();
    }
}
