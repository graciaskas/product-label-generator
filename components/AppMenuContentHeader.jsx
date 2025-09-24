"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

import { Package, User2Icon } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/contexts/AppContextProvider";
//This is the top menu
export default function AppMenuContentHeader() {
  const { user, session } = useContext(AppContext);

  return (
    <div className="flex justify-end gap-2 items-center w-full">
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
      <div
        style={{
          backgroundColor: "oklch(40.40% 0.042 160.33)",
        }}
        className="w-8 h-8  rounded-lg flex items-center justify-center"
      >
        <User2Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h2 className="font-semibold text-lg">
          {session && session.user.email}
        </h2>
      </div>
    </div>
  );
}
