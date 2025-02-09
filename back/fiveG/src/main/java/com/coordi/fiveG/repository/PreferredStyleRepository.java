package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.PreferredStyle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferredStyleRepository extends JpaRepository<PreferredStyle, Integer> {

}
