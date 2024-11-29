"use client";
import Footer from "@/components/AdminElements/Footer";
import Nabar from "@/components/AdminElements/Nabar";
import Sidebar from "@/components/AdminElements/Sidebar";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setisAuthenticated] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("superAdminToken");
    if (!token) {
      setisAuthenticated(false);
      redirect("/admin-super");
    } else {
      setisAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <p>Unauthorized access is strict! Redirecting...</p>;
  }

  return (
    <>
      <Nabar role={"superAdmin"} />
      <Sidebar role={"superAdmin"} />
      {children}
      <Footer />
    </>
  );
}
