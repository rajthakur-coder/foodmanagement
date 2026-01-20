import Icon from "../../ui/Icon";

export const sidebarSections = [
  {
    section: "Menu",
    items: [
      {
        name: "Menu",
        path: "/menu",
        icon: <Icon name="ri-apps-fill" />,
        roles: [ 'Guest'], // Guest role added for QR users
      },
    
      {
        name: "Cart",
        path: "cart",
        icon: <Icon name="ri-shopping-cart-2-fill" />,
        roles: [  'Guest'], // Guest added
      },
          {
        name: "My Orders",
        path: "/myOrder",
        icon: <Icon name="bx bxs-shopping-bag" />,
        roles: [  'Guest'], // Guest added
      },
    ],
  },


];
