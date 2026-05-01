import _ from 'lodash';

export class OrderItem {
    constructor(data) {
        this.id = _.get(data, 'id');
        this.productReference = _.get(data, 'productReference');
        this.productName = _.get(data, 'productName');
        this.productImageUrl = _.get(data, 'productImageUrl');
        this.unitPrice = _.get(data, 'unitPrice', 0) / 100;
        this.quantity = _.get(data, 'quantity', 1);
        this.subtotal = _.get(data, 'subtotal', 0) / 100;
        this.selectedOptions = _.get(data, 'selectedOptions', null);
        this.note = _.get(data, 'note', null);
    }
}

export default class Order {
    constructor(data) {
        this.id = _.get(data, 'id');
        this.orderNumber = _.get(data, 'orderNumber');
        this.status = _.get(data, 'status');
        this.orderType = _.get(data, 'orderType');
        this.total = _.get(data, 'total', 0) / 100;
        this.itemsCount = _.get(data, 'itemsCount');
        this.createdAt = _.get(data, 'createdAt');

        // Detail only fields
        this.paymentMethod = _.get(data, 'paymentMethod', null);
        this.paymentStatus = _.get(data, 'paymentStatus', null);
        this.customerName = _.get(data, 'customerName', null);
        this.customerEmail = _.get(data, 'customerEmail', null);
        this.customerPhone = _.get(data, 'customerPhone', null);
        this.isAnonymousCustomer = _.get(data, 'isAnonymousCustomer', false);
        this.customerNote = _.get(data, 'customerNote', null);
        this.subtotal = data?.subtotal != null ? data.subtotal / 100 : null;
        this.deliveryFee = data?.deliveryFee != null ? data.deliveryFee / 100 : null;
        this.discountAmount = data?.discountAmount != null ? data.discountAmount / 100 : null;
        this.promotionsSnapshot = _.get(data, 'promotionsSnapshot', null);
        this.estimatedDeliveryAt = _.get(data, 'estimatedDeliveryAt', null);
        this.deliveredAt = _.get(data, 'deliveredAt', null);
        this.deliveryAddress = _.get(data, 'deliveryAddress', null);
        this.pointOfSale = _.get(data, 'pointOfSale', null);
        this.items = data?.items ? data.items.map(item => new OrderItem(item)) : null;
    }
}
