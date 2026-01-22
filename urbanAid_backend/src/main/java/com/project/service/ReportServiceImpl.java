package com.project.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.dto.ReportDTO;
import com.project.entities.Report;
import com.project.repository.ReportRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor

public class ReportServiceImpl implements ReportService {
	private final ReportRepository repo;
	private final ModelMapper mapper;

	@Override
	public String createReport(ReportDTO report) {
		Report r=mapper.map(report, Report.class);
		repo.save(r);
		
		return "Report Created Sucessfully";
	}

}
