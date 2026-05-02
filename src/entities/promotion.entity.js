import _ from 'lodash';

export default class Promotion {
    constructor(data) {
        this.id = _.get(data, 'id');
        // this.name = _.get(data, 'name');
        this.title = _.get(data, 'title');
        this.code = _.get(data, 'code', null);
        this.discountPercent = _.get(data, 'discountPercent', null);
        this.discountAmount = _.get(data, 'discountAmount', null);
        this.discountAmountDisplay = _.get(data, 'discountAmountDisplay');
        this.freeDelivery = _.get(data, 'freeDelivery', false);
        this.minAmount = _.get(data, 'minAmount');
        this.startsAt = _.get(data, 'startsAt', null);
        this.endsAt = _.get(data, 'endsAt', null);
        this.usedCount = _.get(data, 'usedCount');
        this.usageLimit = _.get(data, 'usageLimit', null);
        this.usageLimitPerCustomer = _.get(data, 'usageLimitPerCustomer', null);
        this.sort = _.get(data, 'sort');
    }
    get promotionToDisplay() {
        if (!this.discountPercent && !this.discountAmount) {
            return '';
        }
        return '-'+(this.discountPercent ? this.discountPercent+'%' : this.discountAmountDisplay+'€');
    }
}