import React from "react";
import { NavLink } from "react-router-dom";
import { Flame, Coins, Bell } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

const navItems = [
  { label: "Home", to: "/student/dashboard" },
  { label: "My Lessons", to: "/student/lessons" },
  { label: "Community", to: "/student/community" },
];

const StudentHeader = () => {
  return (
    <nav className="sticky top-0 z-50 px-5 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between">
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black text-indigo-600 tracking-tighter italic">
              ELLA
            </span>
          </NavLink>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem>
                  <NavLink to={item.to} className={"rounded-0!"}>
                    {({ isActive }) => (
                      <div
                        className={`${navigationMenuTriggerStyle()} ${isActive ? "text-primary bg-indigo-50/50 border-b-2 rounded-none  border-primary" : "text-muted-foreground hover:text-primary! rounded-none"}`}
                      >
                        {item?.label}
                      </div>
                    )}
                  </NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side: Stats & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Stat */}
            <Badge
              variant="outline"
              className="flex gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 border-orange-100 rounded-full hover:bg-orange-50"
            >
              <Flame size={14} className="fill-orange-600" />
              <span className="font-bold">12</span>
            </Badge>

            {/* Coins Stat */}
            <Badge
              variant="outline"
              className="flex gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border-amber-100 rounded-full hover:bg-amber-50"
            >
              <Coins size={14} className="fill-amber-600" />
              <span className="font-bold">1,420</span>
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Bell size={20} />
            </Button>

            <Avatar className="h-9 w-9 ring-2 ring-indigo-50 shadow-sm transition-transform hover:scale-105 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-600 text-white">
                AS
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentHeader;
