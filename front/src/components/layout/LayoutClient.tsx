import HeaderClient from "../headers/HeaderClient";

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderClient />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default LayoutClient;
