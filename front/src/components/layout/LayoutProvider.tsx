import HeaderProvider from "../headers/HeaderProvider";

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderProvider />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default LayoutProvider;
