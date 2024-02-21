"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import Link from "next/link";
function SearchKBD() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && e.metaKey) {
        setOpen(true);
      }

      if (e.key === "Escape") {
        console.log("esc");
        handleModalToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const managerPages = [
    { name: "Managers Dashboard", route: "/manager" },
    { name: "Announcements", route: "/manager/announcements" },
    { name: "Profile", route: "/profile" },
    {
      name: "Reservation Management",
      route: "/manager/reservation-management",
    },
    { name: "Room Management", route: "/manager/room-management" },
    { name: "Residential Listing", route: "/manager/residential-listing" },
  ];
  const adminPages = [
    { name: "Admins Dashboard", route: "/admin" },
    { name: "Booking Management", route: "/admin/booking-management" },
    { name: "Carousel Management", route: "/admin/carousel-management" },
    { name: "Cities Management", route: "/admin/cities-management" },
    { name: "Hostel Management", route: "/admin/hostel-management" },
    { name: "Manager Management", route: "/admin/manager-management" },
    { name: "Profile", route: "/profile" },
    { name: "Ratings Management", route: "/admin/ratings-management" },

    { name: "Customer Management", route: "/admin/users-management" },
    { name: "Hoster Owner Management", route: "/admin/users-management" },
    { name: "Complaints Management", route: "/admin/users-management" },
  ];
  function handleModalToggle() {
    setOpen(!open);
    setQuery("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[300px] "
      >
        <Search width={15} />
        <span className="h-5 border border-l"></span>
        <span className="inline-block ml-4">Search...</span>
        <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{" "}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Admin">
            {adminPages.map((p) => (
              <Link
                href={p.route}
                onClick={() => setOpen(false)}
                className="block px-2 text-blue-900 underline cursor-pointer"
              >
                <CommandItem>{p.name}</CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Manager">
            {managerPages.map((p) => (
              <Link
                href={p.route}
                onClick={() => setOpen(false)}
                className="block px-2 text-blue-900 underline"
              >
                <CommandItem>{p.name}</CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default SearchKBD;
