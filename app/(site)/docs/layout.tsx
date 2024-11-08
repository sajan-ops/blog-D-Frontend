import DocumentationSidebar from "@/components/DocumentationSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid grid-cols-10 pt-35">
        <DocumentationSidebar />
        <div className="col-span-8">{children}</div>
      </div>
    </>
  );
};

export default RootLayout;
