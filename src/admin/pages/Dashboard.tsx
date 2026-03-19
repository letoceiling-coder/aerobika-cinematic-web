import { useEffect, useState } from 'react';
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import api from '../lib/api';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  recentOrders: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-foreground">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-foreground">Failed to load stats</div>;
  }

  const cards = [
    {
      title: 'Пользователи',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Заказы',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-400',
    },
    {
      title: 'Выручка',
      value: `${stats.revenue.toLocaleString()} ₽`,
      icon: DollarSign,
      color: 'text-yellow-400',
    },
    {
      title: 'Товары',
      value: '—',
      icon: Package,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gold-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">Общая статистика системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Последние заказы</h2>
        <div className="space-y-4">
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground">Нет заказов</p>
          ) : (
            stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-semibold">Заказ #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{order.totalPrice.toLocaleString()} ₽</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
