import H2 from "@/app/_components/H2";
import React from "react";

const Title = () => {
  return (
    <section>
      <div className="p-4">
        <H2 className="mb-2">TITLE</H2>
        <textarea
          placeholder="제목을 입력하세요."
          className="max-h-[60px] min-h-[60px] w-full resize-none rounded-lg bg-gray-50 p-4 text-center text-lg placeholder:text-xl placeholder:font-semibold placeholder:text-gray-100 focus:outline-none"
        />
      </div>
    </section>
  );
};

export default Title;
