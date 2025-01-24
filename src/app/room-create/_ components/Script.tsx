import React from "react";

const Script = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white-100">
      <div>
        <div className="font-bold text-gray-200">Script</div>
        <textarea placeholder="대본을 입력하세요."></textarea>
      </div>
      <form>
        <button
          type="submit"
          className="rounded-lg bg-brand-200 px-4 py-2 font-bold text-white-100 hover:outline-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:ring-offset-2"
        >
          생성하기
        </button>
      </form>
    </div>
  );
};

export default Script;
