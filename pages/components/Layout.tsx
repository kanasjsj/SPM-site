"use client";

import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useAuth, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"; // Hook para autenticação

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const { isSignedIn } = useAuth(); // Estado de autenticação do usuário

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    root.classList.add(initialTheme);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      root.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
    };

    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <>
      <Head>
        <title>SPM Studios</title>
        <meta name="description" content="Bem-vindo ao SPM Studios, um lugar feito para diversão e entretenimento." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#13131d]">
          <Navbar logo={theme === "dark" ? "spm_white.svg" : "spm_black.svg"} />
          <main className="flex justify-center items-center text-gray-600 dark:text-gray-300 flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Layout;