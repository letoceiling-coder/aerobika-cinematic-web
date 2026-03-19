// API URL: use /api in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000');

export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price5l: number;
  price10l: number;
  exchangePrice5l: number | null;
  exchangePrice10l: number | null;
  imageUrl: string | null;
  isActive: boolean;
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
  name: string | null;
  phone: string | null;
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

      const response = await fetch(`${this.baseUrl}/user?initData=${encodeURIComponent(initData)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }

  async getUserOrders(phone?: string): Promise<Order[]> {
    try {
      // MiniApp: use Telegram ID from header
      const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
      const telegramId = tg?.initDataUnsafe?.user?.id;
      
      let url = `${this.baseUrl}/orders?`;
      const params = new URLSearchParams();
      
      if (telegramId) {
        // MiniApp: send telegramId
        params.append('telegramId', telegramId.toString());
        console.log('📱 MiniApp: fetching orders by telegramId:', telegramId);
      } else if (phone) {
        // WEB: send phone
        params.append('phone', phone);
        console.log('🌐 WEB: fetching orders by phone:', phone);
      } else {
        // Fallback: try initData (legacy)
        const initData = this.getInitData();
        if (initData) {
          params.append('initData', initData);
          console.log('📱 Legacy: fetching orders by initData');
        } else {
          console.log('⚠️ No telegramId or phone provided');
          return [];
        }
      }
      
      url += params.toString();
      
      const headers: HeadersInit = {};
      if (telegramId) {
        headers['x-telegram-id'] = telegramId.toString();
      }
      
      const response = await fetch(url, { headers });
      if (!response.ok) {
        console.error('❌ Failed to fetch orders:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      // Handle both { data: [...] } and direct array responses
      const orders = Array.isArray(data) ? data : (data.data || []);
      console.log('✅ Orders fetched:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      return [];
    }
  }

  async addAddress(address: string): Promise<Address | null> {
    try {
      const initData = this.getInitData();
      if (!initData) return null;

      const response = await fetch(`${this.baseUrl}/address`, {
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

      const response = await fetch(`${this.baseUrl}/address/${addressId}`, {
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

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) return [];
      const data = await response.json();
      console.log('📦 Products loaded from API:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
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
    name?: string;
    phone?: string;
    deliveryType: 'free' | 'paid';
  }): Promise<{ id: number; success: boolean } | null> {
    try {
      console.log('🛒 createOrder called with:', { 
        itemsCount: orderData.items?.length,
        address: orderData.address,
        name: orderData.name,
        phone: orderData.phone,
        baseUrl: this.baseUrl 
      });

      const initData = this.getInitData();
      console.log('🔑 initData:', initData ? 'present' : 'missing', initData?.substring(0, 50));
      
      // initData is optional - web version can create orders without it
      const url = `${this.baseUrl}/order`;
      const requestBody: any = {
        ...orderData,
      };
      
      // Only include initData if present (for Telegram Mini App)
      if (initData) {
        requestBody.initData = initData;
        console.log('✅ Including initData for Telegram Mini App');
      } else {
        console.log('🌐 Web version: creating order without initData');
      }
      
      const body = JSON.stringify(requestBody);

      console.log('📤 Sending POST request to:', url);
      console.log('📦 Request body size:', body.length, 'bytes');

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create order' }));
        console.error('❌ Response error:', error);
        throw new Error(error.message || 'Failed to create order');
      }

      const order = await response.json();
      console.log('✅ Order created successfully:', order.id);
      
      return {
        id: order.id,
        success: true,
      };
    } catch (error: any) {
      console.error('❌ Failed to create order:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  }
}

export const apiService = new ApiService();
