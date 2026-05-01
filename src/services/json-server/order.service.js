import Order from '../../entities/order.entity';
import CoreService from '../core/core.service';

export default class OrderService extends CoreService {
    constructor(apiUrl) {
        if (!apiUrl) {
            throw new Error('Missing apiUrl argument for OrderService constructor');
        }
        super(apiUrl);
    }

    get endpointUrl() {
        return `${this.apiUrl}/v1/customer/orders`;
    }

    async getOrders(page = 1, limit = 10) {
        try {
            const { data } = await this.httpGet(
                `${this.endpointUrl}?page=${page}&limit=${limit}`
            );
            return {
                items: (data?.data || []).map(o => new Order(o)),
                pagination: data?.pagination || { page, limit, total: 0, pages: 0 },
            };
        } catch (error) {
            throw {
                status: error.response?.status,
                message: error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue',
            };
        }
    }

    async getOrder(orderId) {
        try {
            const { data } = await this.httpGet(`${this.endpointUrl}/${orderId}`);
            if (!data?.success) {
                throw new Error(data?.error || 'Commande introuvable');
            }
            return new Order(data.order);
        } catch (error) {
            throw {
                status: error.response?.status,
                message: error.response?.data?.error || error.response?.data?.message || error.message || 'Une erreur est survenue',
            };
        }
    }
}
