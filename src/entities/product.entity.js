import _ from 'lodash';

export default class Product {
    constructor(data) {
        this.id = _.get(data, 'id');
        this.name = _.get(data, 'name');
        this.centPrice = _.get(data, 'finalPrice');
        this.price = _.get(data, 'basePriceReadable');
        // this.price = data?.basePrice / 100;
        // this.discountPrice = _.get(data, 'discountPrice', null);
        // this.discountPrice = data?.basePrice !== data?.finalPrice ? data?.finalPrice / 100 : null;
        this.discountPrice = data?.basePriceReadable !== data?.finalPriceReadable ? data?.finalPriceReadable : null;
        this.priceToDisplay = this.discountPrice ?? this.price;
        this.categories = _.get(data, 'categories');
        this.categoriesId = data?.categories?.map(c => c.id) || [];
        this.imageUrl = 'https://media.istockphoto.com/id/1157515115/fr/photo/cheeseburger-isol%C3%A9-sur-le-blanc.jpg?s=612x612&w=0&k=20&c=FO1a6g8NUO_8GzC7IHp4CcXE2d5o_BoFDFC99cyxoTM=';//_.get(data, 'imageUrl');
        this.imageUrl = _.get(data, 'imageUrl');
        this.discountPercentage = _.get(data, 'discountPercentage');
        // this.isMenu = _.get(data, 'isMenu', false);
        this.isMenu = data?.hasMenu === 'YES';
        this.productMenu = _.get(data, 'productMenu', null);
        this.mainProduct = _.get(data, 'mainProduct', null);
        // this.attributes = _.get(data, 'attributes', []);
        this.attributes = _.get(data, 'features', []);
        this.productInformations = data?.productInformations?.length
            ? Object.values(
                data?.productInformations.reduce((acc, item) => {
                    if (!acc[item.groupTitle]) {
                        acc[item.groupTitle] = {
                            title: item.groupTitle,
                            items: []
                        };
                    }

                    acc[item.groupTitle].items.push(item);

                    return acc;
                }, {})
            )
            : [];
    }
}
