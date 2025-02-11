package com.ssafy.dubdub.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dubdub.domain.entity.QCasting;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CastingRepositoryImpl implements CastingRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<String> findRoleNameListByRecruitmentId(Long recruitmentId) {
        QCasting casting = QCasting.casting;

        return queryFactory
                .select(casting.name)
                .from(casting)
                .where(casting.recruitment.id.eq(recruitmentId))
                .fetch();
    }
}

