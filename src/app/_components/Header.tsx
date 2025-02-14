"use client";

import { usePathname } from "next/navigation";

import H3 from "./H3";
import BreadCrumb from "./Breadcrumb";

import Logo from "@/public/images/icons/logo-header.svg";

const Header = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <section
      // className={`flex h-full max-h-[68px] w-full flex-row items-center border ${pathSegments.length <= 2 ? `border-white-300 bg-white-100` : `border-gray-300 bg-gray-400`}`}
      className={`flex h-full max-h-[68px] w-full flex-row items-center border border-gray-300 bg-gray-400`}
    >
      <section className="border-white flex w-[280px] flex-shrink-0 flex-row items-center justify-start gap-x-3 py-6 pl-[34px]">
        <Logo width={32} height={20} />
        <H3 className="text-brand-200">DUB DUB</H3>
      </section>
      <BreadCrumb pathSegments={pathSegments} />
    </section>
  );
};

export default Header;
