"use client";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [showModal, setShowModal] = useState(false);
  return (
    <header className="flex justify-between items-center w-full bg-[#FFFFFF] text-white p-4">
      <h1 className="text-black ml-6 font-bold tracking-wider font-playfair">
        POLARIS DYNAMIC CALENDAR
      </h1>
      <h1 className="text-black mr-12">
        <button
          onClick={() => setShowModal((state) => !state)}
          className="rounded-full border-2 border-[#0F172A] p-1 hover:cursor-pointer"
        >
          <Image
            src="https://docs.nestjs.com/assets/logo-small-gradient.svg"
            alt="Google"
            width={45}
            height={45}
            className="p-1"
          />
        </button>
        {showModal && (
          <div className="fixed top-20 right-4 h-fit w-fit max-w-36 flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg border-2 border-lime-600">
              <a
                href="/auth/login"
                className="flex items-center gap-2 font-sans text-lg font-semibold hover:underline"
              >
                <LogIn /> Login
              </a>
              <hr className="w-full border-2 border-lime-600" />
              <button
                className="w-full min-w-[6rem] bg-black rounded-xl text-white p-2"
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </h1>
    </header>
  );
}
