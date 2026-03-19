import { useEffect, useState } from 'react';
import { Ban, Unlock } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isBlocked: boolean;
  createdAt: string;
}

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users?page=${page}&limit=20`);
      setUsers(response.data.data || response.data);
      setTotal(response.data.total || response.data.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить пользователей',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, {
        isBlocked: !user.isBlocked,
      });
      
      toast({
        title: user.isBlocked ? 'Разблокировано' : 'Заблокировано',
        description: `Пользователь ${user.firstName || user.username || user.telegramId} ${user.isBlocked ? 'разблокирован' : 'заблокирован'}`,
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус пользователя',
        variant: 'destructive',
      });
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
          <span className="gold-text">Пользователи</span>
        </h1>
        <p className="text-muted-foreground">Всего: {total}</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Пользователь</th>
                <th className="text-left py-3 px-4 font-semibold">Telegram ID</th>
                <th className="text-left py-3 px-4 font-semibold">Телефон</th>
                <th className="text-left py-3 px-4 font-semibold">Статус</th>
                <th className="text-left py-3 px-4 font-semibold">Дата регистрации</th>
                <th className="text-left py-3 px-4 font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    Нет пользователей
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold">
                          {user.firstName || ''} {user.lastName || ''}
                        </p>
                        {user.username && (
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-sm">
                      {user.telegramId}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.phone || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {user.isBlocked ? (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                          Заблокирован
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          Активен
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleBlock(user)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                          user.isBlocked
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {user.isBlocked ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Разблокировать
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4" />
                            Заблокировать
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
          >
            Назад
          </button>
          <span className="text-muted-foreground">
            Страница {page} из {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="px-4 py-2 bg-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}
