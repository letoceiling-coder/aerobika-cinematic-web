import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface BotSetting {
  id: number;
  botName: string;
  shortDescription: string | null;
  fullDescription: string | null;
  welcomeMessage: string | null;
  managerChatId: string | null;
  telegramUsername: string | null;
  phone: string | null;
  orderTemplate: string | null;
  city: string | null;
  deliveryPriceOutside: number | null;
  deliveryPriceInside: number | null;
  currency: string | null;
  minOrderAmount: number | null;
  isBotEnabled: boolean;
}

export default function BotSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BotSetting>({
    id: 0,
    botName: '',
    shortDescription: '',
    fullDescription: '',
    welcomeMessage: '',
    managerChatId: '',
    telegramUsername: '',
    phone: '',
    orderTemplate: '',
    city: '',
    deliveryPriceOutside: 0,
    deliveryPriceInside: 0,
    currency: '',
    minOrderAmount: 0,
    isBotEnabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bot-settings');
      const data = response.data;
      setFormData({
        id: data.id || 0,
        botName: data.botName || '',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        welcomeMessage: data.welcomeMessage || '',
        managerChatId: data.managerChatId || '',
        telegramUsername: data.telegramUsername || '',
        phone: data.phone || '',
        orderTemplate: data.orderTemplate || '',
        city: data.city || '',
        deliveryPriceOutside: data.deliveryPriceOutside ?? 0,
        deliveryPriceInside: data.deliveryPriceInside ?? 0,
        currency: data.currency || '',
        minOrderAmount: data.minOrderAmount ?? 0,
        isBotEnabled: data.isBotEnabled ?? true,
      });
    } catch (error) {
      console.error('Failed to fetch bot settings:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить настройки бота',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        botName: formData.botName || '',
        shortDescription: formData.shortDescription || null,
        fullDescription: formData.fullDescription || null,
        welcomeMessage: formData.welcomeMessage || null,
        managerChatId: formData.managerChatId || null,
        telegramUsername: formData.telegramUsername || null,
        phone: formData.phone || null,
        orderTemplate: formData.orderTemplate || null,
        city: formData.city || null,
        deliveryPriceOutside: formData.deliveryPriceOutside ?? null,
        deliveryPriceInside: formData.deliveryPriceInside ?? null,
        currency: formData.currency || null,
        minOrderAmount: formData.minOrderAmount ?? null,
        isBotEnabled: formData.isBotEnabled,
      };

      await api.patch('/bot-settings', submitData);
      
      toast({
        title: 'Сохранено',
        description: 'Настройки бота успешно обновлены',
      });
    } catch (error: any) {
      console.error('Failed to save bot settings:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gold-text">Настройки бота</span>
        </h1>
        <p className="text-muted-foreground">Управление текстами и контактами Telegram бота</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-6">
        {/* Bot Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Название бота</label>
          <input
            type="text"
            value={formData.botName}
            onChange={(e) => setFormData(prev => ({ ...prev, botName: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Короткое описание</label>
          <input
            type="text"
            value={formData.shortDescription || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            placeholder="Краткое описание бота"
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Полное описание</label>
          <textarea
            value={formData.fullDescription || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            rows={4}
            placeholder="Подробное описание бота и услуг"
          />
        </div>

        {/* Welcome Message */}
        <div>
          <label className="block text-sm font-medium mb-2">Приветственное сообщение</label>
          <textarea
            value={formData.welcomeMessage || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            rows={3}
            placeholder="Сообщение, которое отправляется при /start"
          />
        </div>

        {/* Manager Chat ID */}
        <div>
          <label className="block text-sm font-medium mb-2">Chat ID менеджера</label>
          <input
            type="text"
            value={formData.managerChatId || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, managerChatId: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            placeholder="Telegram Chat ID для отправки заказов"
          />
        </div>

        {/* Telegram Username */}
        <div>
          <label className="block text-sm font-medium mb-2">Telegram username</label>
          <input
            type="text"
            value={formData.telegramUsername || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, telegramUsername: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            placeholder="@username"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Телефон</label>
          <input
            type="text"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        {/* Order Template */}
        <div>
          <label className="block text-sm font-medium mb-2">Шаблон сообщения заказа</label>
          <textarea
            value={formData.orderTemplate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, orderTemplate: e.target.value }))}
            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border font-mono text-sm"
            rows={10}
            placeholder={`Новый заказ!
Товар: {product}
Тип: {type}
Кол-во: {quantity}
Адрес: {address}
Имя: {name}
Телефон: {phone}
Сумма: {total} ₽`}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Используйте переменные: {'{product}'}, {'{type}'}, {'{quantity}'}, {'{address}'}, {'{name}'}, {'{phone}'}, {'{total}'}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="gold-gradient text-primary-foreground font-bold px-6 py-3 rounded-lg hover:brightness-110 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Сохранить
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
