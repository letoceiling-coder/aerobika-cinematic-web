import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Package, Phone, Mail, Send, Plus, Trash2 } from 'lucide-react';
import { apiService, type User as UserType, type Order, type Address } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    
    // Check if Telegram WebApp is available
    const initData = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData;
    if (!initData) {
      setLoading(false);
      return;
    }
    
    const [userData, ordersData] = await Promise.all([
      apiService.getUser(),
      apiService.getUserOrders(),
    ]);

    setUser(userData);
    setOrders(ordersData);
    
    // Load addresses from localStorage (using user id if available)
    if (userData) {
      const savedAddresses = localStorage.getItem(`addresses_${userData.telegramId}`);
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    }
    
    setLoading(false);
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;

    const addressData = await apiService.addAddress(newAddress.trim());
    
    if (addressData) {
      const updatedAddresses = [...addresses, addressData];
      setAddresses(updatedAddresses);
      if (user) {
        localStorage.setItem(`addresses_${user.telegramId}`, JSON.stringify(updatedAddresses));
      }
      setNewAddress('');
      setShowAddressModal(false);
    } else {
      // Fallback to localStorage if API fails
      const newAddr: Address = {
        id: Date.now().toString(),
        address: newAddress.trim(),
      };
      const updatedAddresses = [...addresses, newAddr];
      setAddresses(updatedAddresses);
      if (user) {
        localStorage.setItem(`addresses_${user.telegramId}`, JSON.stringify(updatedAddresses));
      }
      setNewAddress('');
      setShowAddressModal(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Удалить адрес?')) return;

    const success = await apiService.deleteAddress(addressId);
    
    if (success || true) { // Always update local state
      const updatedAddresses = addresses.filter((addr) => addr.id !== addressId);
      setAddresses(updatedAddresses);
      if (user) {
        localStorage.setItem(`addresses_${user.telegramId}`, JSON.stringify(updatedAddresses));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Загрузка...</div>
        </div>
        <MobileNav />
      </div>
    );
  }

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Пользователь'
    : 'Пользователь';

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* User Info Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{displayName}</h2>
                {user?.username && (
                  <p className="text-muted-foreground">@{user.username}</p>
                )}
                {user?.phone && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {user.phone}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Addresses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Сохраненные адреса
              </h3>
              <Button
                onClick={() => setShowAddressModal(true)}
                variant="goldOutline"
                size="sm"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Еще нет сохраненных адресов</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-start sm:items-center justify-between gap-3 p-4 bg-secondary rounded-lg"
                  >
                    <p className="text-foreground flex-1 min-w-0 break-words">{address.address}</p>
                    <Button
                      onClick={() => handleDeleteAddress(address.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/20 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              История заказов
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>У вас пока нет заказов</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-secondary rounded-lg border border-border/50"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground">Заказ #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status === 'new' && 'Новый'}
                        {order.status === 'processing' && 'В обработке'}
                        {order.status === 'delivered' && 'Доставлен'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 text-sm">
                          <span className="text-foreground flex-1 min-w-0 break-words">
                            {item.name} ({item.volume}) x{item.quantity}
                          </span>
                          <span className="text-muted-foreground shrink-0 inline-flex items-center gap-1 whitespace-nowrap">
                            <span className="flex-shrink-0">{(item.price * item.quantity).toLocaleString()}</span>
                            <span className="flex-shrink-0">₽</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-border/50">
                      <div className="flex-1 min-w-0">
                        {order.address && (
                          <p className="text-xs text-muted-foreground break-words">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {order.address}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-sm text-muted-foreground">
                          Доставка: {order.deliveryPrice} ₽
                        </p>
                        <p className="text-lg font-bold gold-text inline-flex items-center gap-1 whitespace-nowrap">
                          <span className="flex-shrink-0">{order.totalPrice.toLocaleString()}</span>
                          <span className="flex-shrink-0">₽</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Contact / Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              Контакты
            </h3>
            <div className="space-y-3">
              <a
                href="tel:+79991234567"
                className="flex items-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-foreground">+7 (999) 123-45-67</span>
              </a>
              <a
                href="mailto:info@n2o-delivery.ru"
                className="flex items-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-foreground">info@n2o-delivery.ru</span>
              </a>
              <a
                href="https://t.me/n2o_support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Send className="w-5 h-5 text-primary" />
                <span className="text-foreground">Telegram поддержка</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <AddressModal
          address={newAddress}
          onAddressChange={setNewAddress}
          onSave={handleAddAddress}
          onClose={() => {
            setShowAddressModal(false);
            setNewAddress('');
          }}
        />
      )}

      <MobileNav />
    </div>
  );
};

interface AddressModalProps {
  address: string;
  onAddressChange: (address: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const AddressModal = ({ address, onAddressChange, onSave, onClose }: AddressModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-foreground mb-4">Добавить адрес</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Адрес</label>
            <textarea
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Улица, дом, квартира"
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onSave}
              variant="gold"
              className="flex-1"
              disabled={!address.trim()}
            >
              Сохранить
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Отмена
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
