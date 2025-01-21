const BreadCrumb = () => {
  return (
    <div className="w-full flex flex-row justify-start items-center px-5 py-6 gap-3">
      <h4 className="font-medium text-base leading-none tracking-normal text-[#fefefe] last:border-b-white last:border-b-2">
        HOME
      </h4>
      <h4 className="font-medium text-base leading-none tracking-normal text-[#fefefe] last:border-b-white last:border-b-2">
        LOBBY
      </h4>
      <h4 className="font-medium text-base leading-none tracking-normal text-[#fefefe] last:border-b-white last:border-b-2">
        짱구 더빙하실 분
      </h4>
      <h4 className="font-medium text-base leading-none tracking-normal text-[#fefefe] last:border-b-white last:border-b-2">
        STUDIO
      </h4>
    </div>
  );
};

export default BreadCrumb;
