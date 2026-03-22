import { useState } from 'react';

export default function ResultCard({ posts, platform, onRegenerate }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      alert('コピーできませんでした。手動でテキストを選択してください。');
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
          {platform}用の投稿文 3案
        </p>
        <button
          onClick={onRegenerate}
          style={{
            padding: '6px 14px', fontSize: 12,
            border: '1px solid #ddd', borderRadius: 6,
            background: '#fff', cursor: 'pointer', color: '#555',
          }}
        >
          再生成
        </button>
      </div>

      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #eee', borderRadius: 10,
            padding: '16px', marginBottom: 12, background: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#aaa' }}>案 {index + 1}</span>
            <button
              onClick={() => handleCopy(post, index)}
              style={{
                padding: '3px 12px', fontSize: 11,
                border: '1px solid #ddd', borderRadius: 12,
                background: copiedIndex === index ? '#e8f5e9' : '#fff',
                color:      copiedIndex === index ? '#2e7d32' : '#666',
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {copiedIndex === index ? 'コピー済み' : 'コピー'}
            </button>
          </div>
          <p style={{
            fontSize: 14, lineHeight: 1.7,
            margin: 0, whiteSpace: 'pre-wrap', color: '#333',
          }}>
            {post}
          </p>
          <p style={{ fontSize: 11, color: '#bbb', margin: '8px 0 0', textAlign: 'right' }}>
            {post.length}字
          </p>
        </div>
      ))}
    </div>
  );
}