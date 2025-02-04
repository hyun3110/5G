package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Closets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClosetsRepository extends JpaRepository<Closets, Integer> {

    List<Closets> findByUserId(Long id);

}
