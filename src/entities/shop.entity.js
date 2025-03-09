import _ from 'lodash';

export default class Shop {
    constructor(data) {
        this.id = _.get(data, 'id');
        this.name = _.get(data, 'name');
        this.address = _.get(data, 'address');
        this.image = _.get(data, 'image');
        this.cuisine = _.get(data, 'cuisine');
        this.rating = _.get(data, 'rating');
        this.deliveryTime = _.get(data, 'deliveryTime');
        this.isOpen = _.get(data, 'isOpen');
    }
}
