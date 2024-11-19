// import { GiHolosphere } from "react-icons/gi";
// import { Button } from "./ui/button";
// import { useTheme } from "next-themes";
// import React from "react";
// import { Moon, Sun } from "lucide-react";

// export default function LogoCard() {
//   const { theme, setTheme } = useTheme();
//   const [isChecked, setIsChecked] = React.useState(theme === "dark");

//   const toggleTheme = () => {
//     setIsChecked(!isChecked);
//     setTheme(isChecked ? "light" : "dark");
//   };
//   return (
//     <div className="flex justify-center items-center" dir="rtl">
//       <div className="  max-w-sm w-full">
//         <div className="flex items-center space-x-reverse space-x-4">
//           <div className="flex-shrink-0">
//             <GiHolosphere size={40} />
//           </div>
//           <div className="text-right">
//             <h4 className="text-md font-bold prose-lg">دیلاگ</h4>
//             <p className="text-xs prose-base ">چت بات هوش مصنوعی</p>
//           </div>
//           <Button
//             variant="secondary"
//             size="icon"
//             onClick={toggleTheme}
//             aria-label={`Switch to ${
//               theme === "dark" ? "light" : "dark"
//             } theme`}
//           >
//             {theme === "dark" ? <Moon /> : <Sun />}
//             <span className="sr-only">Toggle theme</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { GiHolosphere } from "react-icons/gi";
import { Button } from "./shadcn/button";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";

export default function LogoCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center" dir="rtl">
        <div className=" max-w-sm w-full">
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="flex-shrink-0">
              <GiHolosphere size={40} />
            </div>
            <div className="text-right">
              <h4 className="text-md font-bold prose-lg">دیلاگ</h4>
              <p className="text-xs prose-base">چت بات هوش مصنوعی</p>
            </div>
            <div className="w-9 h-9" /> {/* Placeholder for the button */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center" dir="rtl">
      <div className=" max-w-sm w-full">
        <div className="flex items-center space-x-reverse justify-between">
          <div className="flex gap-1">
            <Link href="/" className="flex-shrink-0">
              <GiHolosphere size={40} />
            </Link>
            <Link href="/" className="text-right">
              <h4 className="text-md font-bold prose-lg">دیلاگ</h4>
              <p className="text-xs prose-base">چت بات هوش مصنوعی</p>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } theme`}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
