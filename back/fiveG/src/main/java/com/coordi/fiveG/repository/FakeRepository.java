package com.coordi.fiveG.repository;

import com.coordi.fiveG.model.Fake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FakeRepository extends JpaRepository<Fake, Long> {

}
