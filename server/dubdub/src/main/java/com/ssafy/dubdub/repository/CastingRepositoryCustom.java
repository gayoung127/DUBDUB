package com.ssafy.dubdub.repository;

import java.util.List;

public interface CastingRepositoryCustom {
    List<String> findRoleNameListByRecruitmentId(Long recruitmentId);
}
