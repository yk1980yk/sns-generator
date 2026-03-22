const PLATFORMS = ['X（Twitter）', 'Instagram', 'LinkedIn', 'Threads'];
const TONES     = ['フレンドリー', 'プロフェッショナル', 'ユーモラス', '感情的'];
const CHAR_LIMITS = {
  'X（Twitter）': 140,
  'Instagram':    300,
  'LinkedIn':     500,
  'Threads':      500,
};

export default function PostForm({
  platform, setPlatform,
  tone,     setTone,
  theme,    setTheme,
  onGenerate,
  loading,
}) {
  const limit   = CHAR_LIMITS[platform] ?? 300;
  const count   = theme.length;
  const isOver  = count > limit;
  const isEmpty = theme.trim().length === 0;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>SNSプラットフォーム</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => setPlatform(p)} style={pillStyle(p === platform)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>トーン</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TONES.map((t) => (
            <button key={t} onClick={() => setTone(t)} style={pillStyle(t === tone)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>投稿のテーマ・内容</label>
        <textarea
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="例：渋谷にカフェをオープンしました。こだわりのコーヒーが自慢です。"
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 12px', fontSize: 14,
            border: `1px solid ${isOver ? '#e74c3c' : '#ddd'}`,
            borderRadius: 8, resize: 'vertical',
            fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
        <div style={{
          textAlign: 'right', fontSize: 12,
          color: isOver ? '#e74c3c' : '#999', marginTop: 4,
        }}>
          {count} / {limit}字
          {isOver && ' ── 上限を超えています'}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || isEmpty}
        style={{
          width: '100%', padding: '12px 0',
          background: loading || isEmpty ? '#ccc' : '#2d2d2d',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 14, fontWeight: 500,
          cursor: loading || isEmpty ? 'not-allowed' : 'pointer',
          transition: 'background .15s',
        }}
      >
        {loading ? '生成中...' : '投稿文を生成する（3案）'}
      </button>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 12,
  color: '#666', marginBottom: 8,
};

const pillStyle = (isActive) => ({
  padding: '6px 16px',
  borderRadius: 20,
  border: `1px solid ${isActive ? 'transparent' : '#ddd'}`,
  background: isActive ? '#2d2d2d' : '#fff',
  color:      isActive ? '#fff'    : '#555',
  fontSize: 13, cursor: 'pointer',
  transition: 'all .15s',
});