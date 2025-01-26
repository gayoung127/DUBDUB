import React from "react";

const Description = () => {
  return (
    <div className="w-full max-w-2xl p-4">
      <h2 className="mb-4 text-xl font-bold">DESCRIPTION</h2>
      <textarea
        className="min-h-[310px] w-full resize-none rounded-lg bg-gray-50 p-4 focus:outline-none"
        placeholder="간단한 설명을 입력해주세요.
(비방, 욕설X)"
      />
    </div>
  );
};

export default Description;
