package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Clothings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClothingsRepository extends JpaRepository<Clothings, Integer> {

    List<Clothings> findByUserId(Long id);

}
