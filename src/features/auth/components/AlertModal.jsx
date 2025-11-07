import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const AlertModal = ({ isOpen, onClose, message }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel className="w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg text-white">
              <Dialog.Title className="text-xl font-semibold text-red-300">
                Login Error
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-white/80">
                {message}
              </Dialog.Description>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-red-500/70 hover:bg-red-500 text-white transition shadow-md"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AlertModal;