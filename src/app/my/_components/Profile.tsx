"use client";

import React, { useState } from "react";
import Badge from "@/app/_components/Badge";
import Button from "@/app/_components/Button";
import H3 from "@/app/_components/H3";
import H4 from "@/app/_components/H4";
import EditIcon from "@/public/images/icons/icon-edit.svg";
import PersonIcon from "@/public/images/icons/icon-person.svg";
import GradeIcon from "@/public/images/icons/icon-grade.svg";

interface ProfileDataProps {
  nickname: string;
  email: string;
  profileImage: string;
  grade: string;
}
const Profile = ({
  profileData: { nickname, email, profileImage, grade },
}: {
  profileData: ProfileDataProps;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userNickname, setuserNickname] = useState(nickname);
  const [userEmail] = useState(email);
  const [userGrade, setuserGrade] = useState(grade);
  const [userProfileImage, setuserProfileImage] = useState(profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setuserProfileImage(imageUrl);
    }
  };

  function saveEdit() {
    setIsEditing(false);
    // 서버 전송 ,,
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-[700px] w-[80%] flex-col items-center justify-center rounded-[8px] border border-brand-200 bg-brand-100 p-5">
        <H3>내 정보</H3>
        <div className="flex flex-[8] flex-col justify-center gap-5">
          <div className="relative flex justify-center">
            <img
              src={userProfileImage}
              alt="프로필 이미지"
              className="h-[200px] w-[200px] rounded-full object-cover"
            />
            {isEditing && (
              <div className="absolute bottom-5 right-5 flex justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute w-[200px] cursor-pointer opacity-0"
                />
                <div className="rounded-full border border-white-300 bg-white-bg p-2">
                  <EditIcon />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-5">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <div className="shadow-sm flex w-[250px] items-center rounded-lg bg-white-bg px-3 py-2">
                  <PersonIcon className="h-5 w-5" />
                  <input
                    type="text"
                    value={userNickname}
                    onChange={(e) => {
                      setuserNickname(e.target.value);
                    }}
                    className="ml-2 w-full border-none bg-transparent text-gray-700 outline-none focus:ring-0"
                  />
                </div>
                <div className="shadow-sm flex w-[250px] items-center rounded-lg bg-white-bg px-3 py-2">
                  <GradeIcon className="h-6 w-6" />
                  <select
                    value={userGrade}
                    onChange={(e) => setuserGrade(e.target.value)}
                    className="ml-2 w-full border-none bg-transparent text-gray-700 outline-none focus:ring-0"
                  >
                    <option value="PRO">PRO</option>
                    <option value="AMA">AMA</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <H3>{userNickname}</H3>
                <Badge selected={false} title={userGrade} />
              </>
            )}
            <H4>{userEmail}</H4>
          </div>
        </div>
        <div className="flex-[2]">
          {isEditing ? (
            <div className="flex gap-2">
              <Button outline onClick={saveEdit} className="bg-white-100">
                저장
              </Button>
              <Button
                outline
                onClick={() => {
                  setIsEditing(false);
                  setuserNickname(nickname);
                  setuserProfileImage(profileImage);
                  setuserGrade(grade);
                }}
                className="bg-white-100"
              >
                취소
              </Button>
            </div>
          ) : (
            <Button
              outline
              onClick={() => {
                setIsEditing(true);
              }}
              className="bg-white-100"
            >
              프로필 수정
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
