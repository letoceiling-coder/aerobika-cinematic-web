import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Order {
  id: number;
  totalPrice: number;
  deliveryPrice: number;
  address: string;
  name?: string;
  phone?: string;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    phone?: string;
  };
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/admin?page=${page}&limit=20`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return <div className="text-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gold-text">Заказы</span>
        </h1>
        <p className="text-muted-foreground">Управление заказами</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">Нет заказов</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-secondary rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-bold">Заказ #{order.id}</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.user.firstName} {order.user.lastName} (@{order.user.username})
                  </p>
                  {(order.phone || order.user.phone) && (
                    <p className="text-sm text-muted-foreground">
                      📞 {order.phone || order.user.phone}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{(order.totalPrice + order.deliveryPrice).toLocaleString()} ₽</p>
                    <p className="text-sm text-muted-foreground">
                      Товары: {order.totalPrice.toLocaleString()} ₽
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Доставка: {order.deliveryPrice === 0 ? 'Бесплатно' : `${order.deliveryPrice.toLocaleString()} ₽`}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  >
                    <option value="new">Новый</option>
                    <option value="processing">В обработке</option>
                    <option value="delivered">Доставлен</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
