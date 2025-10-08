import { TBox } from './TBox';
import { TUser } from './TUser';

export type TShipping = {
  id: string;
  boxUserId: string;
  boxUser: {
    id: string;
    userId: string;
    user: TUser;
    boxId: string;
    box: TBox;
    timeActive: string;
    timeEnd: string;
    createdAt: string;
  };
  scheduledAt: string;
  estimatedArrivalMinutes: number | null;
  estimatedArrivalAt: string | null;
  shipperId: string | null;
  shipper: TUser | null;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryUserDetail: string | null;
  deliveryNote: string;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deliveryDay: string;
  deliveryWeek: string;
  shipperConfidence?: string | null;
  trafficCondition?: string | null;
  weatherCondition?: string | null;
};
