import React from "react";

const Role = () => {
  return (
    <section className="mb-2 p-4">
      <h2 className="mb-2 text-xl font-bold">ROLE</h2>
      <div className="flex items-center gap-3">
        <button className="rounded-full border-2 border-brand-200 px-4 py-2 text-lg text-brand-200">
          짱구 X
        </button>
        <button className="rounded-full border-2 border-brand-200 px-4 py-2 text-lg text-brand-200">
          철수 X
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-200 bg-white-100 text-xl font-bold text-brand-200 transition-colors duration-200">
          +
        </button>
      </div>
    </section>
  );
};

export default Role;
