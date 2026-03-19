import { useEffect, useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface Broadcast {
  id: number;
  title: string | null;
  message: string;
  target: 'all' | 'selected';
  status: 'draft' | 'sent';
  createdAt: string;
  sentAt: string | null;
}

interface User {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  isBlocked: boolean;
}

export default function Broadcast() {
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all' | 'selected'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<number | null>(null);

  useEffect(() => {
    fetchBroadcasts();
    fetchUsers();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const response = await api.get('/broadcast');
      setBroadcasts(response.data);
    } catch (error) {
      console.error('Failed to fetch broadcasts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users?page=1&limit=1000');
      const allUsers = response.data.data || response.data;
      setUsers(allUsers.filter((u: User) => !u.isBlocked));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await api.post('/broadcast', {
        title: title.trim() || null,
        message: message.trim(),
        target,
        userIds: target === 'selected' ? selectedUserIds : undefined,
      });
      
      toast({
        title: 'Создано',
        description: 'Рассылка успешно создана',
      });
      
      setTitle('');
      setMessage('');
      setTarget('all');
      setSelectedUserIds([]);
      fetchBroadcasts();
    } catch (error: any) {
      console.error('Failed to create broadcast:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось создать рассылку',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm('Отправить рассылку?')) return;

    setSending(id);
    try {
      const response = await api.post(`/broadcast/${id}/send`);
      
      toast({
        title: 'Отправлено',
        description: `Успешно: ${response.data.successCount}, Ошибок: ${response.data.failCount}`,
      });
      
      fetchBroadcasts();
    } catch (error: any) {
      console.error('Failed to send broadcast:', error);
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось отправить рассылку',
        variant: 'destructive',
      });
    } finally {
      setSending(null);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gold-text">Рассылка</span>
        </h1>
        <p className="text-muted-foreground">Отправка сообщений пользователям</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleCreate} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Название (необязательно)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
              placeholder="Название рассылки"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Сообщение</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border min-h-[120px]"
              placeholder="Введите сообщение для рассылки..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Получатели</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="all"
                  checked={target === 'all'}
                  onChange={(e) => {
                    setTarget('all');
                    setSelectedUserIds([]);
                  }}
                  className="w-4 h-4"
                />
                <span>Всем пользователям</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="selected"
                  checked={target === 'selected'}
                  onChange={(e) => setTarget('selected')}
                  className="w-4 h-4"
                />
                <span>Выбранным пользователям</span>
              </label>
            </div>
          </div>

          {target === 'selected' && (
            <div className="bg-secondary rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-sm font-medium mb-3">
                Выбрано: {selectedUserIds.length} из {users.length}
              </p>
              <div className="space-y-2">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-background/50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {user.firstName || ''} {user.lastName || ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username || 'N/A'} • {user.telegramId}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !message.trim() || (target === 'selected' && selectedUserIds.length === 0)}
            className="gold-gradient text-primary-foreground font-bold px-6 py-3 rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Создать рассылку'}
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">История рассылок</h2>
          {broadcasts.length === 0 ? (
            <p className="text-muted-foreground">Нет рассылок</p>
          ) : (
            broadcasts.map((broadcast) => (
              <div
                key={broadcast.id}
                className="p-4 bg-secondary rounded-lg flex items-start justify-between"
              >
                <div className="flex-1">
                  {broadcast.title && (
                    <h3 className="font-bold mb-2">{broadcast.title}</h3>
                  )}
                  <p className="mb-2 whitespace-pre-wrap">{broadcast.message}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Получатели: {broadcast.target === 'all' ? 'Все' : 'Выбранные'}</span>
                    <span>
                      Создано: {new Date(broadcast.createdAt).toLocaleString('ru-RU')}
                    </span>
                    {broadcast.status === 'sent' && broadcast.sentAt && (
                      <span>
                        Отправлено: {new Date(broadcast.sentAt).toLocaleString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  {broadcast.status === 'sent' ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Отправлено
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSend(broadcast.id)}
                      disabled={sending === broadcast.id}
                      className="gold-gradient text-primary-foreground font-bold px-4 py-2 rounded-lg hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending === broadcast.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Отправить
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
