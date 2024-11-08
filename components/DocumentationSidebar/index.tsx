"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import React from "react";

const SidebarLink = () => {
  const pathname = usePathname();

  // Restructured links into grouped sections
  const sections: any = [
    {
      id: 1,
      links: [
        { title: "Authentication ", href: "/docs" },
        { title: "Post & Media", href: "/docs/second-page" },
      ],
    },
    {
      id: 2,
      links: [
        { title: "SEO Tools", href: "/docs/third-page" },
        { title: "Traffic, Reach", href: "/docs/fourth-page" },
      ],
    },
  ];

  // Flatten links for finding active index
  const allLinks = sections.flatMap((section) => section.links);
  const activeIndex = allLinks.findIndex((link) => link.href === pathname);

  // Check if a section is completed
  const isSectionCompleted = (sectionId) => {
    const sectionLinks = sections.find((s) => s.id === sectionId).links;
    const lastLinkInSection = sectionLinks[sectionLinks.length - 1];
    const lastLinkIndex = allLinks.findIndex(
      (link) => link.href === lastLinkInSection.href,
    );
    return lastLinkIndex <= activeIndex;
  };

  return (
    <div className="relative col-span-2 pl-10">
      <ul className="relative">
        {/* Background line */}
        <div className="absolute left-[9px] top-0 h-full w-0.5 bg-gray-200" />

        {/* Active progress line */}
        <div
          className="absolute left-[9px] top-0 w-0.5 bg-blue-500 transition-all duration-300"
          style={{
            height: `${(activeIndex + 1) * 25}%`,
          }}
        />

        {/* Sections and their links */}
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            {section.links.map((link, linkIndex) => {
              const isActive = pathname === link.href;
              const isCompleted = isSectionCompleted(section.id);
              const showCheckmark = isCompleted && !isActive;

              return (
                <li key={link.href} className="relative mb-6 last:mb-0">
                  <div
                    className={`absolute left-0 top-1 z-10 h-5 w-5 rounded-full border-2 border-white transition-colors duration-300 
                      ${isActive || isCompleted ? "bg-blue-500" : "bg-gray-200"}
                      ${
                        showCheckmark
                          ? "flex items-center justify-center p-0.5"
                          : ""
                      }`}
                  >
                    {showCheckmark && (
                      <Check
                        className="h-full w-full text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <Link
                    href={link.href}
                    className={`ml-8 flex rounded-sm px-3 py-2 text-base transition-colors duration-300
                      ${
                        isActive
                          ? "font-medium text-blue-500"
                          : isCompleted
                          ? "text-blue-500 hover:text-blue-400"
                          : "text-gray-500 hover:text-blue-400"
                      } dark:text-white`}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default SidebarLink;
