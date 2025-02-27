'use client';

import { FormEvent, useState, useRef } from "react";
import { IconEdit } from "@tabler/icons-react";
import { updateStudyName } from '@/lib/actions';

const EditStudyModal = ({
  studyId,
  studyName,
  setTriggerFetch
}: {
  studyId: string;
  studyName: string;
  setTriggerFetch: (arg: boolean) => void;
} ) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  const onCancel = () => {
    setModalOpen(false);
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() || "";
    if (!name) {
      setError("Study title cannot be empty.");
      return;
    }
    try {
      await updateStudyName(studyId, name);
      setModalOpen(false);
      setTriggerFetch(true);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <>
      <button 
        className="hover:text-primary"
        ref={trigger}
        onClick={() => {
            setModalOpen(true);
        }} >
        <IconEdit />
      </button>

      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
        >
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Rename to
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <form onSubmit={onSubmit}>
              <input type="hidden" name="id" value={studyId} />  
              <input
                type="text"
                min={2}
                max={50}
                defaultValue={studyName}
                name="name"
                id="name"
                className="w-full rounded-lg border-[2px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />

              <div className="-mx-3 my-10 flex flex-wrap gap-y-4">
                <div className="w-full px-3 2xsm:w-1/2">
                  <button type="reset"
                    onClick={onCancel}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                  Cancel
                  </button>
                </div>
                <div className="w-full px-3 2xsm:w-1/2">
                  <button type="submit"
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                  OK
                  </button>
                </div>
              </div>
            </form>
            {error ?
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
                  <span className="block sm:inline">{error}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                      <button onClick={()=>{setError(null)}}>
                          <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                      </button>
                  </span>
              </div> : <div></div>
            }
        </div>
      </div>
    </>
  );
};

export default EditStudyModal;
