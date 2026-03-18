const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export interface Order {
  id: number;
  items: Array<{
    name: string;
    volume: string;
    type: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  deliveryPrice: number;
  address: string | null;
  status: 'new' | 'processing' | 'delivered';
  createdAt: string;
}

export interface Address {
  id: string;
  address: string;
  isDefault?: boolean;
}

class ApiService {
  private baseUrl = API_URL;

  // Get initData from Telegram WebApp
  private getInitData(): string | null {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
      return (window as any).Telegram.WebApp.initData;
    }
    return null;
  }

  async getUser(): Promise<User | null> {
    try {
      const initData = this.getInitData();
      if (!initData) return null;

      const response = await fetch(`${this.baseUrl}/api/user?initData=${encodeURIComponent(initData)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      const initData = this.getInitData();
      if (!initData) return [];

      const response = await fetch(`${this.baseUrl}/api/orders?initData=${encodeURIComponent(initData)}`);
      if (!response.ok) return [];
      const data = await response.json();
      // Handle both { data: [...] } and direct array responses
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  }

  async addAddress(address: string): Promise<Address | null> {
    try {
      const initData = this.getInitData();
      if (!initData) return null;

      const response = await fetch(`${this.baseUrl}/api/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, address }),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to add address:', error);
      return null;
    }
  }

  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const initData = this.getInitData();
      if (!initData) return false;

      const response = await fetch(`${this.baseUrl}/api/address/${addressId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to delete address:', error);
      return false;
    }
  }

  async createOrder(orderData: {
    items: Array<{
      name: string;
      volume: string;
      type: string;
      price: number;
      quantity: number;
    }>;
    address?: string;
    deliveryType: 'free' | 'paid';
  }): Promise<{ id: number; success: boolean } | null> {
    try {
      const initData = this.getInitData();
      if (!initData) {
        throw new Error('Telegram initData is required');
      }

      const response = await fetch(`${this.baseUrl}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          ...orderData,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create order' }));
        throw new Error(error.message || 'Failed to create order');
      }

      const order = await response.json();
      return {
        id: order.id,
        success: true,
      };
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
