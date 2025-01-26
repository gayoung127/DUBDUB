"use client";

import Header from "../_components/Header";
import DubbingInfo from "./_components/DubbingInfo";
import Role from "./_components/Role";
import ScriptSection from "./_components/ScriptSection";
import { RoleData, ScriptData } from "./type";
import { useState } from "react";
import ActionButton from "./_components/ActionButton";

export default function RoomDetailPage() {
  function getDubbingInfo() {
    const dubbingInfoData = {
      thumbnail: dubbingInfoDummy.thumbnail,
      roomStatus: dubbingInfoDummy.roomStatus,
      title: dubbingInfoDummy.title,
      dubbingDate: dubbingInfoDummy.dubbingDate,
      badges: dubbingInfoDummy.badges,
      description: dubbingInfoDummy.description,
    };
    return dubbingInfoData;
  }
  const dubbingInfoData = getDubbingInfo();

  function getRolesData() {
    const roles: RoleData[] = RoleDataDummy;
    return roles;
  }
  const roles = getRolesData();

  function getScriptData() {
    const scripts: ScriptData[] = scriptDummy;
    return scripts;
  }
  const scripts = getScriptData();

  const [selectedRoles, setSelectedRoles] = useState<RoleData[]>([]);
  const [isRoleSelected, setIsRoleSelected] = useState<boolean>(false);

  const handleRoleSelect = (roles: RoleData[], isSelected: boolean) => {
    setSelectedRoles(roles);
    setIsRoleSelected(isSelected);
  };

  const handleApplyClick = () => {
    if (isRoleSelected && selectedRoles.length > 0) {
      alert(
        `${dubbingInfoData.title}: ${selectedRoles.map((r) => r.role)} 역에 참가하시겠습니까?`,
      );
    } else {
      alert("역할 선택 안 함");
    }
  };

  const handleEnterStudio = () => {
    alert("스튜디오에 입장합니다.");
  };

  const handleCancelDubbing = () => {
    alert("더빙 취소합니다.");
  };
  const handleCancelApplication = () => {
    alert("참가 신청을 취소합니다.");
  };

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAppling, setIsAppling] = useState<boolean>(false);

  return (
    <div className="flex h-full w-full flex-col items-center bg-white-bg">
      <Header />
      <main className="p-6">
        <div className="flex w-full max-w-screen-xl flex-row justify-center gap-4 p-6">
          <div className="flex flex-col gap-2 p-1">
            <DubbingInfo dubbingInfoData={dubbingInfoData} />
            <Role roles={roles} onRoleSelect={handleRoleSelect} />
          </div>
          <ScriptSection scripts={scripts} />
        </div>
        <div className="flex flex-row-reverse gap-4 px-8 py-2">
          {isOwner ? (
            <div className="flex flex-row-reverse gap-4 px-8 py-2">
              <ActionButton
                onClick={() => handleCancelDubbing()}
                buttonLabel="더빙 취소"
              />
              <ActionButton
                onClick={() => handleEnterStudio()}
                buttonLabel="스튜디오 입장"
              />
            </div>
          ) : isAppling ? (
            <div className="flex flex-row-reverse gap-4 px-8 py-2">
              <ActionButton
                onClick={() => handleCancelApplication()}
                buttonLabel="참가 취소"
              />
              <ActionButton
                onClick={() => handleEnterStudio()}
                buttonLabel="스튜디오 입장"
              />
            </div>
          ) : (
            <div className="flex flex-row-reverse gap-4 px-8 py-2">
              <ActionButton
                onClick={() => handleApplyClick()}
                buttonLabel="신청하기"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

//더미 데이터
const dubbingInfoDummy = {
  thumbnail: "images/tmp/dducip.jpg",
  roomStatus: "대기중",
  title: "짱구 더빙하실 분",
  dubbingDate: "2/21 17:00 - 19:00",
  badges: [
    "영화",
    "애니메이션",
    "다큐멘터리",
    "드라마",
    "광고/CF",
    "SF",
    "액션",
    "코믹",
    "일상",
    "스릴러",
    "공포",
    "로맨스",
    "판타지",
    "기타",
  ],
  description:
    "짱구 더빙하는 나 너무 일하기 싫어 어떻게 이렇게 일을 하기가 싫을 수가 있어. 이게 맞는 건가? 더미 데이터를 지피티한테 만들어달라고 할걸. 하하하하하ㅏ핳ㅁㅇㄴㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄹㄴㅁㅇㄻㄴㅇㄻㄴㅇㄹㄴㅁㅇㄻㄴㅇㄹㄴㅁㅇㄹㄴㅇㅁㄹ",
};

const RoleDataDummy = [
  {
    id: "1",
    role: "짱구",
    profileImage: "images/tmp/dducip.jpg",
    nickname: "누구게",
    selectedBy: "1",
  },

  {
    id: "2",
    role: "유리",
    profileImage: null,
    nickname: null,
    selectedBy: null,
  },

  {
    id: "3",
    role: "철수",
    profileImage: "images/tmp/dducip.jpg",
    nickname: "누구게",
    selectedBy: "3",
  },

  {
    id: "4",
    role: "맹구",
    profileImage: "images/tmp/dducip.jpg",
    nickname: "누구게",
    selectedBy: "4",
  },
  {
    id: "5",
    role: "훈이",
    profileImage: null,
    nickname: null,
    selectedBy: null,
  },

  {
    id: "6",
    role: "흰둥이",
    profileImage: null,
    nickname: null,
    selectedBy: null,
  },
];

const scriptDummy = [
  {
    role: "짱구",
    script: "나는 짱구야?",
  },
  {
    role: "철수",
    script: "그래, 너는 짱구야. 그런데 왜 물어보는 거야?",
  },
  {
    role: "짱구",
    script: "그냥, 혹시 내가 아닌 줄 알고.",
  },
  {
    role: "유리",
    script: "너는 그냥 딱 봐도 짱구야. 그런 걸 물어보는 게 더 이상하잖아.",
  },
  {
    role: "맹구",
    script: "짱구는 오늘도 독특한 생각을 하는구나.",
  },
  {
    role: "흰둥이",
    script: "멍멍! (아마도, 맞아 너는 짱구야!)",
  },
  {
    role: "훈이",
    script: "근데 짱구야, 점심은 뭐 먹을 거야?",
  },
  {
    role: "짱구",
    script: "당연히 초코비! 너희도 같이 먹을래?",
  },
  {
    role: "철수",
    script: "초코비 말고 제대로 된 밥을 먹자니까!",
  },
  {
    role: "유리",
    script: "나 초코비 싫어!",
  },
  {
    role: "맹구",
    script: "그러면 짱구야, 초코비 말고 뭐 좋아해?",
  },
  {
    role: "짱구",
    script: "음... 초코비랑 비슷한 걸로 초코 케이크?",
  },
  {
    role: "훈이",
    script: "결국 초코는 포기 못하네.",
  },
  {
    role: "유리",
    script: "초코만 먹으면 살쪄! 그러니까 당장 그만 먹어.",
  },
  {
    role: "짱구",
    script: "괜찮아~ 난 귀여운 얼굴로 다 커버되니까!",
  },
  {
    role: "철수",
    script: "그래도 건강 생각해서 밥 좀 먹어야 해.",
  },
  {
    role: "흰둥이",
    script: "멍멍! (짱구 말이 맞는 거 같아!)",
  },
  {
    role: "맹구",
    script: "그럼 오늘 점심은 우리가 짱구를 위해 뭘 먹을지 정해볼까?",
  },
  {
    role: "짱구",
    script: "오케이! 하지만 내 조건은 초코가 들어가야 돼!",
  },
  {
    role: "훈이",
    script: "그게 조건이야...? 진짜 고집 센다.",
  },
];
