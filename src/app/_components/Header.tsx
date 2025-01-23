import BreadCrumb from "./Breadcrumb";
import H4 from "./H4";

const Header = () => {
  return (
    <section className="flex h-full max-h-[68px] w-full flex-row items-center border border-gray-300 bg-gray-400">
      <section className="border-white w-[280px] flex-shrink-0 flex-row items-center justify-start py-6 pl-[34px]">
        <H4 className="font-bold text-brand-200">로고</H4>
      </section>
      <BreadCrumb />
    </section>
  );
};

export default Header;
