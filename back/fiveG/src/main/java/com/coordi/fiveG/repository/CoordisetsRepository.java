package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Coordisets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoordisetsRepository extends JpaRepository<Coordisets, Integer> {

    List<Coordisets> findByUserId(Long id);
}
