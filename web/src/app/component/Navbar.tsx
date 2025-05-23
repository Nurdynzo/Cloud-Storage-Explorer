import React from "react";
import Image from "next/image";
import pluralLogomain from "../images/pluralLogomain.png";

const Navbar = () => {
  return (
    <div className="py-4 px-6">
      <div className="flex items-center gap-3 animate-fade-in">
        <Image
          src={pluralLogomain.src}
          alt="Background pattern"
          width={127.843}
          height={40}
          priority
          className="z-0 relative"
        />
        <span className="text-[#112b66] text-3xl font-bold tracking-tight">
          Dumps
        </span>
      </div>
    </div>
  );
};

export default Navbar;
