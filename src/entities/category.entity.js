import _ from 'lodash';

export default class Category {
    constructor(data) {
        this.id = _.get(data, 'id');
        this.name = _.get(data, 'name');
        this.imageUrl = _.get(data, 'imageUrl');
    }
}