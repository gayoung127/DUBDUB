package com.ssafy.dubdub.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.*;
import com.ssafy.dubdub.enums.ParticipationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RecruitmentRepositoryImpl implements RecruitmentRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    private static final QRecruitment recruitment = QRecruitment.recruitment;
    private static final QMember member = QMember.member;
    private static final QGenre genre = QGenre.genre;
    private static final QCategory category = QCategory.category;
    private static final QCasting casting = QCasting.casting;
    private static final QStudio studio = QStudio.studio;

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
        JPAQuery<Boolean> hasActiveStudioSubquery = queryFactory
                .select(studio.isClosed.isFalse())
                .from(studio)
                .where(studio.recruitment.eq(recruitment));

        return Optional.ofNullable(
                queryFactory
                        .select(recruitment.count())
                        .from(recruitment)
                        .where(
                                isOnAir(condition.getOnAir(), hasActiveStudioSubquery),
                                isPrivateEq(condition.getIsPrivate()),
                                genreIn(condition.getGenreIds()),
                                categoryIn(condition.getCategoryIds()),
                                isRecruiting(condition.getIsRecruiting()),
                                participationType(condition.getParticipationType(), member)
                        )
                        .fetchOne()
        ).orElse(0L);
    }

    private List<Recruitment> getRecruitments(RecruitmentSearchRequestDTO condition, Member member) {

        JPAQuery<Boolean> hasActiveStudioSubquery = queryFactory
                .select(studio.isClosed.isFalse())
                .from(studio)
                .where(studio.recruitment.eq(recruitment));

        return queryFactory
                .selectFrom(recruitment)
                .leftJoin(recruitment.author).fetchJoin()
                .leftJoin(recruitment.genres).fetchJoin()
                .leftJoin(recruitment.categories).fetchJoin()
                .where(
                        isOnAir(condition.getOnAir(), hasActiveStudioSubquery),
                        isPrivateEq(condition.getIsPrivate()),
                        genreIn(condition.getGenreIds()),
                        categoryIn(condition.getCategoryIds()),
                        isRecruiting(condition.getIsRecruiting()),
                        participationType(condition.getParticipationType(), member)
                )
                .offset((long) Optional.ofNullable(condition.getPage()).orElse(0) *
                        Optional.ofNullable(condition.getSize()).orElse(10))
                .limit(Optional.ofNullable(condition.getSize()).orElse(10))
                .orderBy(recruitment.createdAt.desc())
                .fetch();
    }

    private BooleanExpression isOnAir(Boolean onAir, JPAQuery<Boolean> hasActiveStudioSubquery) {
        return Optional.ofNullable(onAir)
                .filter(Boolean::booleanValue)
                .map(__ -> recruitment.startTime.loe(LocalDateTime.now())
                        .and(recruitment.endTime.goe(LocalDateTime.now()))
                        .or(hasActiveStudioSubquery.exists()))
                .orElse(null);
    }

    private BooleanExpression isPrivateEq(Boolean isPrivate) {
        return Optional.ofNullable(isPrivate)
                .map(recruitment.isPrivate::eq)
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

    private BooleanExpression isRecruiting(Boolean isRecruiting) {
        return Optional.ofNullable(isRecruiting)
                .map(recruitment.isRecruiting::eq)
                .orElse(null);
    }

    private BooleanExpression participationType(String participationType, Member member) {
        return Optional.ofNullable(participationType)
                .map(type -> {
                    Long currentUserId = member.getId();
                    return switch (ParticipationType.valueOf(type)) {
                        case MY -> recruitment.castings.any().memberId.eq(currentUserId);
                        default -> null;
                    };
                })
                .orElse(null);
    }
}
