import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
      LayoutDashboard, 
      ShoppingCart, 
      Package, 
      Users, 
      MessageSquare,
      Settings,
      FileText,
      LogOut
    } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Заказы' },
    { path: '/admin/products', icon: Package, label: 'Товары' },
    { path: '/admin/users', icon: Users, label: 'Пользователи' },
    { path: '/admin/broadcast', icon: MessageSquare, label: 'Рассылка' },
    { path: '/admin/bot-settings', icon: Settings, label: 'Настройки бота' },
    { path: '/admin/content', icon: FileText, label: 'Контент' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            <span className="gold-text">N2O Admin</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'gold-gradient text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
