import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "white" | "bgBlue" | "transparent";
  title?: string;
  heightFull?: boolean;
}

export default function Card({
  children,
  variant = "white",
  title,
  heightFull = false,
}: CardProps) {
  return (
    <div className={`${heightFull && "h-full"}`}>
      {title && (
        <h3 className="font-extrabold uppercase text-xl md:text-2xl mb-1 md:mb-3">
          {title}
        </h3>
      )}
      <div
        className={`rounded-xl
          ${heightFull && "h-full"}
    ${variant === "white" && "bg-white shadow-xl p-8"}
    ${variant === "transparent" && "b-white"}
    ${
      variant === "bgBlue" &&
      "bg-[url(/img/bg-blue.jpg)] bg-cover shadow-xl p-8"
    }
    `}
      >
        {children}
      </div>
    </div>
  );
}
