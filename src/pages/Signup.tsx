import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";


import {
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const Signup = () => {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});


  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!loading && user)
    return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs: FormErrors = {};

    if (!name.trim())
      errs.name = "Name is required";

    if (!email.trim())
      errs.email = "Email is required";

    if (!password)
      errs.password = "Password is required";

    if (password.length < 8)
      errs.password =
        "Password must be at least 8 characters";

    if (password !== confirmPassword)
      errs.confirmPassword =
        "Passwords do not match";

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);


  



/*if (data.user) {
  const { error: insertError } = await supabase.from("profiles").insert([
    {
      id: data.user.id,
      email: data.user.email,
      name:
        data.user.user_metadata?.name ||
        data.user.email.split("@")[0],
      avatar_url: `https://api.dicebear.com/9.x/initials/svg?seed=${data.user.email}`,
    },
  ]);

  console.log("INSERT ERROR:", insertError);
}*/

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });



  /*  if (error) {
      setIsLoading(false);

      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

*/
    // 📦 Step 2: Insert into DB
    /*const { error: dbError } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        name,
        email,
        skills: "",
        learning_goals: "",
      },
    ]);*/


    if (data.user) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email: data.user.email,
          name,
          avatar_url: `https://api.dicebear.com/9.x/initials/svg?seed=${data.user.email}`,
        },
      ]);
    }


    


   if (error) {

  setIsLoading(false);

  toast({
    title: "Signup failed",
    description: error.message,
    variant: "destructive",
  });

  return;
}
    

    toast({
      title: "Account created 🚀",
      description:
        "Welcome to PeerLearn!",

    });

    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#020817] text-white">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* GLOWS */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-cyan-500/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-blue-600/20 blur-[140px]" />

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-16 relative z-10">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-cyan-300">
            🚀 Future of Collaborative Learning
          </div>

          <h1 className="text-6xl font-extrabold leading-tight">
            Join The
            <br />

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PeerLearn
            </span>

            <br />

            Community.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            Learn from seniors, collaborate
            with peers, join live mentorship
            sessions, and grow together in a
            futuristic AI-powered ecosystem.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
              🔥 1200+ Students
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
              🎯 300+ Mentors
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
              🚀 AI Powered Learning
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-3xl border border-cyan-400/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,211,238,0.15)]"
        >

          {/* LOGO */}
          <div className="mb-8 text-center">


        

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]">


                <BookOpen className="h-6 w-6 text-black" />

              </div>

              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                PeerLearn
              </span>
            </Link>

            <h2 className="mt-8 text-3xl font-bold text-white">
              Create Account
            </h2>

            <p className="mt-2 text-slate-400">
              Begin your futuristic learning
              journey
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}
            <div>
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="h-12 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400"
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <Input
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="h-12 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">

              <Input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="h-12 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-400">
                {errors.password}
              </p>
            )}

            {/* CONFIRM PASSWORD */}
            <div className="relative">

              <Input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="h-12 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}

            {/* REMEMBER */}
            <div className="flex items-center gap-2">

              <Checkbox
                checked={rememberMe}
                onCheckedChange={(c) =>
                  setRememberMe(!!c)
                }
              />

              <span className="text-sm text-slate-300">
                I agree to the Terms &
                Privacy Policy
              </span>
            </div>

            {/* BUTTON */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:opacity-90"
              >
                {isLoading
                  ? "Creating..."
                  : "Create Account"}

                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          {/* LOGIN */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;