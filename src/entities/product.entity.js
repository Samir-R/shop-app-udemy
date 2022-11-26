import _ from 'lodash';

export default class Product {
    constructor(data) {
        this.id = _.get(data, 'id');
        this.name = _.get(data, 'name');
        this.price = _.get(data, 'price');
        this.categories = _.get(data, 'categories');
        this.imageUrl = 'https://media.istockphoto.com/id/1157515115/fr/photo/cheeseburger-isol%C3%A9-sur-le-blanc.jpg?s=612x612&w=0&k=20&c=FO1a6g8NUO_8GzC7IHp4CcXE2d5o_BoFDFC99cyxoTM=';//_.get(data, 'imageUrl');
        this.discountPercentage = _.get(data, 'discountPercentage');
    }
}