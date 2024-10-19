"use client"
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
    let token = localStorage.getItem("adminToken")
    if (!token) {
      setisAuthenticated(false)
      redirect("/admin")
    } else {
      setisAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) {
    return (<p>Unauthorized access is strict! Redirecting...</p>);
  };

  return (
    <>
      <Nabar />
      <Sidebar />
      {children}
      <Footer />
    </>
  );
}
