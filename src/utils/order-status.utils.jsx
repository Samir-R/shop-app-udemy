import React from 'react';
import { IoTimeOutline, IoCheckmarkCircleOutline, IoRestaurantOutline, IoCheckmarkDoneOutline, IoCarOutline, IoCloseCircleOutline, IoCashOutline, IoWalkOutline } from 'react-icons/io5';
import {MdDeliveryDining, MdOutlineDeliveryDining, MdOutlineSchedule} from "react-icons/md";
import {PiCookingPot} from "react-icons/pi";
import {TbCreditCardRefund, TbPaperBag, TbPaperBagOff} from "react-icons/tb";
import {LuHandPlatter} from "react-icons/lu";

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
};

export const ORDER_TYPE = {
    DELIVERY: 'DELIVERY',
    PICKUP: 'PICKUP',
    ON_SITE: 'ON_SITE',
};

const STATUS_CONFIG = {
    [ORDER_STATUS.PENDING]:          { label: 'En attente',      color: '#ff9800', Icon: MdOutlineSchedule },
    [ORDER_STATUS.CONFIRMED]:        { label: 'Confirmée',       color: '#1976d2', Icon: IoCheckmarkCircleOutline },
    // [ORDER_STATUS.PREPARING]:        { label: 'En préparation',  color: '#ff9800', Icon: IoRestaurantOutline },
    [ORDER_STATUS.PREPARING]:        { label: 'En préparation',  color: '#ff9800', Icon: PiCookingPot },
    [ORDER_STATUS.READY]:            { label: 'Prête',           color: '#4caf50', Icon: IoCheckmarkDoneOutline },
    [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: 'En livraison',    color: '#1976d2', Icon: MdDeliveryDining },
    [ORDER_STATUS.DELIVERED]:        { label: 'Livrée',          color: '#4caf50', Icon: TbPaperBag },
    [ORDER_STATUS.CANCELLED]:        { label: 'Annulée',         color: '#f44336', Icon: TbPaperBagOff },
    // [ORDER_STATUS.REFUNDED]:         { label: 'Remboursée',      color: '#666',    Icon: IoCashOutline },
    [ORDER_STATUS.REFUNDED]:         { label: 'Remboursée',      color: '#666',    Icon: TbCreditCardRefund },
};

const TYPE_CONFIG = {
    [ORDER_TYPE.DELIVERY]: { label: 'Livraison',  Icon: MdOutlineDeliveryDining },
    [ORDER_TYPE.PICKUP]:   { label: 'Retrait',    Icon: LuHandPlatter },
    [ORDER_TYPE.ON_SITE]:  { label: 'Sur place',  Icon: IoRestaurantOutline },
};

export function getStatusConfig(status) {
    return STATUS_CONFIG[status] ?? { label: status, color: '#666', Icon: IoTimeOutline };
}

export function getStatusColor(status) {
    return getStatusConfig(status).color;
}

export function getStatusLabel(status) {
    return getStatusConfig(status).label;
}

export function getStatusIcon(status, size = 20) {
    const { Icon, color } = getStatusConfig(status);
    return <Icon color={color} size={size} />;
}

export function getOrderTypeConfig(orderType) {
    return TYPE_CONFIG[orderType] ?? { label: orderType, Icon: IoRestaurantOutline };
}

export function getOrderTypeLabel(orderType) {
    return getOrderTypeConfig(orderType).label;
}

export function getOrderTypeIcon(orderType, size = 20) {
    const { Icon } = getOrderTypeConfig(orderType);
    return <Icon size={size} style={{ marginLeft: '7px' }} />;
}
