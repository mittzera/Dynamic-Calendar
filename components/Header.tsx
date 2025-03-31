import Image from "next/image";

export function Header() {
  return (
    <header className="flex justify-between items-center w-full bg-[#FFFFFF] text-white p-4">
      <h1 className="text-black ml-6 font-bold tracking-wide font-playfair">
        POLARIS DYNAMIC CALENDAR
      </h1>
      <h1 className="text-black mr-6">
        <Image
          src="https://docs.nestjs.com/assets/logo-small-gradient.svg"
          alt="Google"
          width={45}
          height={45}
          className="rounded-full border-[2px] border-dashed border-[#0F172A] p-1 hover:cursor-pointer"
        />
      </h1>
    </header>
  );
}
