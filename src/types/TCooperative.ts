import { TProduct } from './TProduct';

export type TCooperative = {
    id: string;
    name: string;
    address: string;
    phone: string;
    website: string | null;
    description: string | null;
    images: string; // JSON string
    raw: any;
    createdAt: string;
    updatedAt: string;
};

export type TProductCooperative = {
    productId: string;
    cooperativeId: string;
    cooperative: TCooperative;
    supplyCapacity: number;
    unit: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
};
