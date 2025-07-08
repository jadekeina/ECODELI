import HeaderShopOwner from "../headers/HeaderShopOwner";

const LayoutShopOwner = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <HeaderShopOwner />
            <main className="min-h-screen">{children}</main>
        </>
    );
};

export default LayoutShopOwner;
