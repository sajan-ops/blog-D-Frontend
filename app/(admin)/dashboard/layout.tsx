
import Footer from "@/components/AdminElements/Footer";
import Nabar from "@/components/AdminElements/Nabar";
import Sidebar from "@/components/AdminElements/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nabar />
      <Sidebar/>
      {children}
      <Footer />
    </>
  );
}
