import BreadcrumbNextIcon from "@/public/images/icons/icon-breadcrumb-next.svg";

const BreadCrumb = () => {
  return (
    <div className="flex w-full flex-row items-center justify-start gap-3 px-5 py-6">
      <h4 className="last:border-b-white text-base font-medium leading-none tracking-normal text-[#fefefe] last:border-b-2">
        HOME
      </h4>
      <BreadcrumbNextIcon width={20} height={20} />
      <h4 className="last:border-b-white text-base font-medium leading-none tracking-normal text-[#fefefe] last:border-b-2">
        LOBBY
      </h4>
      <BreadcrumbNextIcon width={20} height={20} />
      <h4 className="last:border-b-white text-base font-medium leading-none tracking-normal text-[#fefefe] last:border-b-2">
        짱구 더빙하실 분
      </h4>
      <BreadcrumbNextIcon width={20} height={20} />
      <h4 className="last:border-b-white text-base font-medium leading-none tracking-normal text-[#fefefe] last:border-b-2">
        STUDIO
      </h4>
    </div>
  );
};

export default BreadCrumb;
