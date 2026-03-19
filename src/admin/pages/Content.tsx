import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentBlock {
  id: number;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'image';
  page: string | null;
  block: string | null;
  label: string | null;
}

interface GroupedContent {
  [page: string]: {
    [block: string]: ContentBlock[];
  };
}

const PAGES = [
  { id: 'home', label: 'Главная' },
  { id: 'global', label: 'Футер' },
];

export default function Content() {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [editedBlocks, setEditedBlocks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/content');
      const data = response.data;
      setBlocks(data);
      
      // Auto-expand all blocks on load
      const allBlocks = new Set<string>();
      data.forEach((block: ContentBlock) => {
        if (block.page && block.block) {
          allBlocks.add(`${block.page}-${block.block}`);
        }
      });
      setExpandedBlocks(allBlocks);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить контент.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setEditedBlocks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = blocks.map((block) => ({
        key: block.key,
        value: editedBlocks[block.key] !== undefined ? editedBlocks[block.key] : block.value,
        type: block.type,
        page: block.page,
        block: block.block,
        label: block.label,
      }));

      await api.patch('/content', { content: updates });
      
      // Update local state
      setBlocks((prev) =>
        prev.map((block) => ({
          ...block,
          value: editedBlocks[block.key] !== undefined ? editedBlocks[block.key] : block.value,
        }))
      );
      
      setEditedBlocks({});
      
      toast({
        title: 'Успех',
        description: 'Контент сохранен.',
      });
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить контент.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleBlock = (page: string, block: string) => {
    const key = `${page}-${block}`;
    setExpandedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Group content by page and block
  const groupedContent: GroupedContent = {};
  blocks.forEach((block) => {
    const page = block.page || 'other';
    const blockName = block.block || 'other';
    
    if (!groupedContent[page]) {
      groupedContent[page] = {};
    }
    if (!groupedContent[page][blockName]) {
      groupedContent[page][blockName] = [];
    }
    groupedContent[page][blockName].push(block);
  });

  // Get blocks for active tab
  const activePageContent = groupedContent[activeTab] || {};
  const blockNames = Object.keys(activePageContent).sort();

  if (loading) {
    return <div className="text-foreground">Загрузка контента...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gold-text">Управление контентом</span>
          </h1>
          <p className="text-muted-foreground">Редактирование текстов и изображений сайта</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || Object.keys(editedBlocks).length === 0}
          className="gold-gradient text-primary-foreground font-bold px-6 py-3 rounded-lg hover:brightness-110 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          Сохранить изменения
        </Button>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl p-1">
        <div className="flex gap-1">
          {PAGES.map((page) => {
            const hasContent = groupedContent[page.id] && Object.keys(groupedContent[page.id]).length > 0;
            if (!hasContent && page.id !== 'home') return null;
            
            return (
              <button
                key={page.id}
                onClick={() => setActiveTab(page.id)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === page.id
                    ? 'gold-gradient text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {page.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blockNames.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
            Нет контента для этой страницы
          </div>
        ) : (
          blockNames.map((blockName) => {
            const blockKey = `${activeTab}-${blockName}`;
            const isExpanded = expandedBlocks.has(blockKey);
            const blockItems = activePageContent[blockName];
            const blockLabel = blockItems[0]?.block 
              ? blockItems[0].block.charAt(0).toUpperCase() + blockItems[0].block.slice(1) + ' блок'
              : blockName;

            return (
              <div key={blockKey} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleBlock(activeTab, blockName)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-foreground">{blockLabel}</h3>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-4 border-t border-border/50">
                    {blockItems.map((block) => (
                      <div key={block.id} className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          {block.label || block.key}
                        </label>
                        {block.type === 'textarea' ? (
                          <textarea
                            value={editedBlocks[block.key] !== undefined ? editedBlocks[block.key] : block.value}
                            onChange={(e) => handleChange(block.key, e.target.value)}
                            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
                          />
                        ) : block.type === 'image' ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editedBlocks[block.key] !== undefined ? editedBlocks[block.key] : block.value}
                              onChange={(e) => handleChange(block.key, e.target.value)}
                              placeholder="URL изображения"
                              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {block.value && (
                              <img
                                src={block.value}
                                alt={block.label || block.key}
                                className="w-32 h-32 object-cover rounded-lg border border-border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={editedBlocks[block.key] !== undefined ? editedBlocks[block.key] : block.value}
                            onChange={(e) => handleChange(block.key, e.target.value)}
                            className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
