import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import HeaderClient from "./HeaderClient";
import HeaderDeliveryDriver from "./HeaderDeliveryDriver";
import HeaderProvider from "./HeaderProvider";
import HeaderShopOwner from "./HeaderShopOwner";

const HeaderConnected = () => {
  const { user } = useContext(UserContext);

  if (!user) return null;

  switch (user.role) {
    case "client":
      return <HeaderClient />;
    case "delivery_driver":
      return <HeaderDeliveryDriver />;
    case "provider":
      return <HeaderProvider />;
    case "shop_owner":
      return <HeaderShopOwner />;
    default:
      return null;
  }
};

export default HeaderConnected;
