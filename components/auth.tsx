// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { FcGoogle } from "react-icons/fc";
// import Image from "next/image";
// import { supabase } from "@/utils/supabase-client";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// const formSchema = z.object({
//   email: z.string().email({ message: "آدرس ایمیل نامعتبر است" }),
// });

// export default function Component() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       // Assuming an async login function
//       console.log(values);
//       toast(
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(values, null, 2)}</code>
//         </pre>
//       );
//     } catch (error) {
//       console.error("Form submission error", error);
//       toast.error("Failed to submit the form. Please try again.");
//     }
//   }

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: process.env.NEXT_PUBLIC_SUPABASE_URL,
//       },
//     });
//     if (error) {
//       alert(error.message);
//     }
//     setLoading(false);
//   };
//   const handleSendMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });
//     if (error) {
//       alert(error.message);
//     } else {
//       alert("Check your email for the login link!");
//     }
//     setLoading(false);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4"
//       dir="rtl"
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Card className="w-full  overflow-hidden border  shadow-md">
//           <CardHeader className="space-y-1 text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{
//                 delay: 0.2,
//                 type: "spring",
//                 stiffness: 260,
//                 damping: 20,
//               }}
//               className="w-16 h-16  rounded-full mx-auto mb-4 flex items-center justify-center"
//             >
//               <Image src="/logo.png" width={30} height={30} alt="logo" />
//             </motion.div>
//             <CardTitle className="text-2xl font-bold">
//               ورود به حساب کاربری
//             </CardTitle>
//             <CardDescription>برای ورود، ایمیل خود را وارد کنید</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSendMagicLink} className="space-y-4">
//               <div className="space-y-2">
//                 <Input
//                   type="email"
//                   placeholder="ایمیل شما"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="text-right "
//                 />
//               </div>
//               <Button type="submit" className="w-full  ">
//                 ارسال لینک ورود
//               </Button>
//             </form>
//             <div className="mt-4 relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">
//                   یا
//                 </span>
//               </div>
//             </div>
//             <Button
//               onClick={handleGoogleLogin}
//               variant="outline"
//               className="w-full mt-4 "
//             >
//               <FcGoogle />
//               ورود با گوگل
//             </Button>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

import { useState } from "react";
import { supabase } from "@/utils/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    } else {
      // Sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        alert(error.message);
      } else {
        alert("Check your email for the confirmation link!");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <form onSubmit={handleEmailAction} className="space-y-4">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading" : isLogin ? "Sign In" : "Sign Up"}
        </Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need to create an account?" : "Already have an account?"}
      </Button>
      <div className="text-center">or</div>
      <Button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? "Loading" : "Sign in with Google"}
      </Button>
    </div>
  );
}
