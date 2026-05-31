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

    async getOrder(orderId, email = null) {
        try {
            const url = email
                ? `${this.endpointUrl}/${orderId}?email=${encodeURIComponent(email)}`
                : `${this.endpointUrl}/${orderId}`;
            const { data } = await this.httpGet(url);
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

    async cancelOrder(orderId, email = null) {
        try {
            const body = email ? { email } : {};
            const { data } = await this.httpPost(
                `${this.endpointUrl}/${orderId}/cancel`,
                body,
                { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
            );
            if (!data?.success) {
                throw { message: data?.error ?? 'Impossible d\'annuler la commande' };
            }
            return data;
        } catch (error) {
            const responseData = error.response?.data;
            throw {
                status: error.response?.status,
                message: responseData?.error || error.message || 'Impossible d\'annuler la commande',
            };
        }
    }

    async createPaymentIntent(orderId, email = null) {
        try {
            const body = email ? { email } : {};
            const { data } = await this.httpPost(
                `${this.endpointUrl}/${orderId}/payment-intent`,
                body,
                { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
            );
            if (!data?.success) {
                throw { message: data?.error ?? 'Erreur lors de la création du paiement' };
            }
            return data; // { success, clientSecret, stripeAccountId }
        } catch (error) {
            const responseData = error.response?.data;
            throw {
                status: error.response?.status,
                message: responseData?.error || error.message || 'Une erreur est survenue',
            };
        }
    }

    async createOrder(body) {
        try {
            const { data } = await this.httpPost(
                this.endpointUrl,
                body,
                { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
            );
            return data;
        } catch (error) {
            const responseData = error.response?.data;
            throw {
                status: error.response?.status,
                errors: responseData?.errors ?? null,
                message: responseData?.message || 'Une erreur est survenue',
            };
        }
    }
}
