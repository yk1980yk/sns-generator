import { useState } from 'react';
import PostForm   from './PostForm';
import ResultCard from './ResultCard';

export default function App() {
  const [platform, setPlatform] = useState('X（Twitter）');
  const [tone,     setTone]     = useState('フレンドリー');
  const [theme,    setTheme]    = useState('');
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('テーマを入力してください');
      return;
    }
    setLoading(true);
    setError('');
    setPosts([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, tone, theme }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '生成に失敗しました');
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
        SNS投稿ジェネレーター
      </h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 32 }}>
        テーマを入れるだけでAIが投稿文を3案作成します
      </p>
      <PostForm
        platform={platform}  setPlatform={setPlatform}
        tone={tone}          setTone={setTone}
        theme={theme}        setTheme={setTheme}
        onGenerate={handleGenerate}
        loading={loading}
      />
      {error && (
        <p style={{ color: '#c0392b', fontSize: 13, marginTop: 12 }}>{error}</p>
      )}
      {posts.length > 0 && (
        <ResultCard posts={posts} platform={platform} onRegenerate={handleGenerate} />
      )}
    </div>
  );
}