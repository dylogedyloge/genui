"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import { Card } from "./shadcn/card";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/utils/supabase-client";
// import Image from "next/image";
// import { Meteors } from "./ui/meteors";
import { GiHolosphere } from "react-icons/gi";

export default function Component() {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const iconVariants = {
    hover: {
      rotate: -360,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
    });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="relative w-full max-w-md overflow-hidden">
        <div className=" w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
          <motion.div
            className="relative z-10 p-8 "
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* <Image
              src="/logo.png"
              height={30}
              width={30}
              alt="dyloge"
              className="mx-auto mb-10"
            /> */}
            <GiHolosphere size={40} className="mx-auto mb-10" />

            <h2 className="text-3xl font-bold text-center mb-6 ">خوش آمدید</h2>
            <p className="text-center mb-8 ">
              برای ادامه وارد حساب کاربری خود شوید
            </p>
            <motion.div
              className="flex justify-center"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="default"
                  size="lg"
                  className={`w-full py-6 text-md font-semibold border-2 duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={loading ? undefined : handleGoogleLogin}
                >
                  <motion.span
                    className="ml-2"
                    variants={iconVariants}
                    animate={isHovered ? "hover" : ""}
                  >
                    <FcGoogle className="h-6 w-6" />
                  </motion.span>
                  ورود با گوگل
                </Button>
              </motion.div>
            </motion.div>
            <p className="text-center text-sm  mt-8">
              با ورود، شما{" "}
              <a href="#" className="text-muted-foreground hover:underline">
                شرایط استفاده از خدمات
              </a>{" "}
              و{" "}
              <a href="#" className="text-muted-foreground hover:underline">
                سیاست حفظ حریم خصوصی
              </a>{" "}
              ما را می‌پذیرید
            </p>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
