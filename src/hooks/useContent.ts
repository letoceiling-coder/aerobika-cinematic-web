import { useState, useEffect } from 'react';

interface ContentBlock {
  id: number;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'image';
}

interface ContentMap {
  [key: string]: string;
}

export const useContent = () => {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data: ContentBlock[] = await response.json();
          const contentMap: ContentMap = {};
          data.forEach((block) => {
            contentMap[block.key] = block.value;
          });
          setContent(contentMap);
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const get = (key: string, fallback: string = ''): string => {
    return content[key] || fallback;
  };

  return { content, loading, get };
};
