import {
  LucideBook,
  LucideFileText,
  LucideFolder,
  LucideLayoutDashboard,
  LucidePuzzle,
  LucideWand2,
} from "lucide-react";
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

  return (
    <div className="w-[300px] h-full bg-white p-4 rounded-lg">
      <nav className="flex flex-col gap-2">
        {navLinks.map((item, idx) =>
          item.children ? (
            <div key={item.label}>
              <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
                {item.icon}
                {item.label}
              </div>
              <div className="ml-6 flex flex-col gap-1">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                  >
                    {child.icon}
                    {child.label}
                  </a>
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
    </div>
  );
}

export default Sidebar;
