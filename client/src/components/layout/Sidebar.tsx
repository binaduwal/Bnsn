import {
  CircleUser,
  LogOut,
  LucideBook,
  LucideFileText,
  LucideFolder,
  LucideLayoutDashboard,
  LucidePuzzle,
  LucideWand2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function Sidebar() {
  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LucideLayoutDashboard size={20} />,
    },
    {
      label: "Blueprint",
      href: "/dashboard/blueprint",
      icon: <LucideFileText size={20} />,
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: <LucideFolder size={20} />,
    },
    {
      label: "Add On",
      icon: <LucidePuzzle size={20} />,
      children: [
        {
          label: "Book Builder",
          href: "/dashboard/add-on/book-builder",
          icon: <LucideBook size={18} />,
        },
        {
          label: "Improver",
          href: "/dashboard/add-on/improver",
          icon: <LucideWand2 size={18} />,
        },
      ],
    },
  ];
  const bottomNavLinks = [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <CircleUser size={20} />,
    },
    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: <LucideFileText size={20} />,
    },
    {
      label: "Logout",
      // href: "/dashboard/projects",
      icon: <LogOut size={20} />,
    },
  ];

  return (
    <div className="w-[300px] h-full flex flex-col justify-between bg-white p-4 rounded-lg">
      <nav className="flex flex-col  gap-2">
        {navLinks.map((item, idx) =>
          item.children ? (
            <div key={item.label}>
              <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
                {item.icon}
                {item.label}
              </div>
              <div className="ml-6 flex flex-col gap-1">
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                  >
                    {child.icon}
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              {item.icon}
              {item.label}
            </a>
          )
        )}
      </nav>
      <nav className="flex flex-col  gap-2">
        {bottomNavLinks.map((item, idx) => (
          <Link
            key={item.label}
            href={item.href || "#"}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
