'use client';

import Image from "next/image";
import Link from "next/link";
import Tabs from "./Tabs";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({
  studyName,
  studyPassage
}: {
  studyName: string;
  studyPassage: string;
} ) => {
  return (
    <header className="sticky left-0 top-0 z-9999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex w-full items-center justify-between xl:w-2/12 2xl:w-2/12">
          <Link className="block flex-shrink-0" href="/">
            <Image
              width={46}
              height={46}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 ">


          <h4 className="text-primary text-title-sm font-bold">{studyName}</h4>

          <h4 className="text-black text-title-sm dark:text-white">Psalm {studyPassage}</h4>

        </div>

        <div className="hidden sm:block">

        <Tabs />

        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <LanguageSwitcher />
            {/* <!-- Dark Mode Toggler --> */}
            {/*<DarkModeSwitcher />*/}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/*<DropdownNotification />*/}
            {/* <!-- Notification Menu Area --> */}

          </ul>

          {/* <!-- User Area --> */}
          {/*<DropdownUser /> */}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
