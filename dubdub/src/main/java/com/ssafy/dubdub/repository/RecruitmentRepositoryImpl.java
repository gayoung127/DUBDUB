package com.ssafy.dubdub.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.*;
import com.ssafy.dubdub.enums.ParticipationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RecruitmentRepositoryImpl implements RecruitmentRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    private static final QRecruitment recruitment = QRecruitment.recruitment;

    @Override
    public Page<Recruitment> findBySearchCondition(RecruitmentSearchRequestDTO condition, Member member) {
        Long total = getTotal(condition, member);
        List<Recruitment> recruitments = getRecruitments(condition, member);

        return new PageImpl<>(recruitments,
                PageRequest.of(
                        Optional.ofNullable(condition.getPage()).orElse(0),
                        Optional.ofNullable(condition.getSize()).orElse(10)
                ),
                total);
    }

    private Long getTotal(RecruitmentSearchRequestDTO condition, Member member) {
        return Optional.ofNullable(
                queryFactory
                        .select(recruitment.count())
                        .from(recruitment)
                        .where(
                                keywordIn(condition.getSearchKeyword()),
                                genreIn(condition.getGenreIds()),
                                categoryIn(condition.getCategoryIds()),
                                participationType(condition.getParticipationType(), member)
                        )
                        .fetchOne()
        ).orElse(0L);
    }

    private List<Recruitment> getRecruitments(RecruitmentSearchRequestDTO condition, Member member) {
        return queryFactory
                .selectFrom(recruitment)
                .leftJoin(recruitment.genres).fetchJoin()
                .leftJoin(recruitment.categories).fetchJoin()
                .where(
                        keywordIn(condition.getSearchKeyword()),
                        genreIn(condition.getGenreIds()),
                        categoryIn(condition.getCategoryIds()),
                        participationType(condition.getParticipationType(), member)
                )
                .offset((long) Optional.ofNullable(condition.getPage()).orElse(0) *
                        Optional.ofNullable(condition.getSize()).orElse(10))
                .limit(Optional.ofNullable(condition.getSize()).orElse(10))
                .orderBy(recruitment.createdAt.desc())
                .fetch();
    }

    private BooleanExpression keywordIn(String searchKeyword){
        return Optional.ofNullable(searchKeyword)
                .map(recruitment.title::containsIgnoreCase)
                .orElse(null);
    }

    private BooleanExpression genreIn(List<Long> genreIds) {
        return Optional.ofNullable(genreIds)
                .filter(list -> !list.isEmpty())
                .map(list -> recruitment.genres.any().genre.id.in(list))
                .orElse(null);
    }

    private BooleanExpression categoryIn(List<Long> categoryIds) {
        return Optional.ofNullable(categoryIds)
                .filter(list -> !list.isEmpty())
                .map(list -> recruitment.categories.any().category.id.in(list))
                .orElse(null);
    }

    private BooleanExpression participationType(ParticipationType conditionType, Member member) {
        return Optional.ofNullable(conditionType)
                .map(type -> {
                    Long currentUserId = member.getId();
                    return switch (conditionType) {
                        case CREATED -> recruitment.author.id.eq(currentUserId);
                        case JOINED -> recruitment.castings.any().memberId.eq(currentUserId);
                        default -> null;
                    };
                })
                .orElse(null);
    }
}
