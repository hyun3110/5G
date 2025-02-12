package com.coordi.fiveG.controller;

import com.coordi.fiveG.model.Fake;
import com.coordi.fiveG.service.FakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/fake")
public class FakeController {

    private final FakeService fakeService;

    @GetMapping("/")
    public Fake fake(@RequestParam("id") Long id){
        return fakeService.fake(id);
    }

}
