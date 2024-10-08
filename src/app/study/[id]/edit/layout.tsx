"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/StudyPane/Header";
import NewStudyModal from "@/components/Modals/NewStudy";


export default function Layout({ children }: { children: React.ReactNode }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createStudyOpen, setCreateStudyOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (

    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex h-screen">
          {/* <!-- ===== Sidebar Start ===== --> */}
          {/*<Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            createStudyOpen={createStudyOpen}
            setCreateStudyOpen={setCreateStudyOpen}
           />*/}
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col">
            {/* <!-- ===== Study Content Start ===== --> */}
            {children}
            {/* <!-- ===== Study Content End ===== --> */}
             {/* <!-- ===== Create Study Modal Start ===== --> */}
             {/*<NewStudyModal open={createStudyOpen} setOpen={setCreateStudyOpen} />*/}
            {/* <!-- ===== Create Study Modal End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
      )}
    </div>
  );
}
