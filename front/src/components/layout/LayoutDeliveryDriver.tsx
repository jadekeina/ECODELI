import HeaderDeliveryDriver from "../headers/HeaderDeliveryDriver";

const LayoutDeliveryDriver = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <HeaderDeliveryDriver />
            <main className="min-h-screen">{children}</main>
        </>
    );
};

export default LayoutDeliveryDriver;
