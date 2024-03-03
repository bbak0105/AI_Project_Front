import {
  IconBrandOffice,
  IconBuildingWarehouse,
  IconCoin,
  IconLayoutDashboard, 
  IconShoppingCart,
  IconReportAnalytics
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  // [1]. 첫 번째 탭
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Predict Inventory',
    icon: IconBuildingWarehouse,
    href: '/predict',
  },
  // [2]. 두 번째 탭
  {
    navlabel: true,
    subheader: 'Others',
  },
  {
    id: uniqueId(),
    title: 'Shop',
    icon: IconShoppingCart,
    href: '/shop',
  },
  {
    id: uniqueId(),
    title: 'Analyze Other Report',
    icon: IconReportAnalytics,
    href: '/fileUpload',
  },
];

export default Menuitems;
