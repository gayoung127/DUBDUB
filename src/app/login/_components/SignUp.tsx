import React, { useState } from "react";
import { UserProfile } from "../type";
import Button from "@/app/_components/Button";

const SignUp = () => {
  const [user, setUser] = useState<UserProfile>({
    id: "1",
    nickname: "임시임시",
    profileImage: null,
    userType: "Amateur",
    isTermsAgreed: false,
  });
  const [isAgreed, setIsAgreed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //프로필 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUser((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  //닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      nickname: e.target.value,
    }));
  };

  //타입(프로, 아마추어) 변경 핸들러
  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser((prev) => ({
      ...prev,
      userType: e.target.value,
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAgreed || !user.nickname || !user.userType) {
      alert("다 안 채워짐");
      return;
    }

    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("nickname", user.nickname);
    formData.append("userType", user.userType);
    formData.append("isTermsAgreed", String(isAgreed));

    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    try {
      const response = await fetch("api/signup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("가입 중에 서버 응답 오류");
      }

      window.location.replace("/lobby");
    } catch (error) {
      console.error("가입 실패: ", error);
      alert("가입 중 오류!");
    }
  };

  return (
    <div className="left-0 flex min-h-screen w-[440px] flex-col items-center bg-brand-100 bg-opacity-80 px-6 py-6">
      <div className="relative h-[700px] w-[390px] items-center overflow-hidden rounded-lg bg-white-900">
        <div className="absolute left-[-500px] top-[-1200px] h-[1400px] w-[1400px] rounded-full bg-brand-100"></div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-6 pt-[120px]"
        >
          <div className="relative flex h-[132px] w-[132px] gap-4 rounded-full">
            <img
              src={user.profileImage || "images/icons/icon-person.svg"}
              className="h-full w-full rounded-full bg-white-200 object-cover"
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 h-8 w-8 cursor-pointer items-center justify-center rounded-full border-[4px] border-white-900 bg-white-300"
            >
              <img src="/images/icons/icon-edit.svg" className="h-6 w-6" />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex w-[344px] flex-row items-center gap-2 rounded-md border border-white-300 bg-white-900 p-4 focus-within:border-brand-200 focus-within:bg-brand-100">
            <label>
              <img
                src="/images/icons/icon-person.svg"
                className="h-6 w-6"
                alt=""
              />
            </label>
            <input
              type="text"
              placeholder="닉네임 입력"
              value={user.nickname}
              onChange={handleNicknameChange}
              className="w-full bg-transparent pt-1 text-gray-200 outline-none"
              required
            />
          </div>

          <div
            className="relative flex w-[344px] rounded-md border border-white-300 bg-white-900 p-4 focus-within:border-brand-200 focus-within:bg-brand-100"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <span className="text-gray-200">{user.userType}</span>

            <select
              value={user.userType}
              onChange={handleUserTypeChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              required
            >
              <option value="Amateur">Amateur</option>
              <option value="Pro">Pro</option>
            </select>

            <button
              type="button"
              className="ml-auto flex h-6 w-6 items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-gray-100 transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div className="flex w-[344px] max-w-[390px] items-center gap-4 pt-[100px]">
            <input
              type="checkbox"
              id="terms"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
              className="h-5 w-5 cursor-pointer"
              required
            />
            <label htmlFor="terms" className="cursor-pointer text-gray-100">
              이용약관 동의(필수)
            </label>
          </div>

          <button
            disabled={!isAgreed}
            className={`w-[344px] rounded-md py-3 ${
              isAgreed
                ? "bg-brand-100 text-brand-200"
                : "cursor-not-allowed bg-white-300 text-gray-100"
            }`}
          >
            가입완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
