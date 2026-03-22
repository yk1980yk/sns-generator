export default function ApiKeyInput({ apiKey, setApiKey }) {
  return (
    <div style={{
      border: '1px solid #e8f4fd',
      borderRadius: 10,
      padding: '16px',
      marginBottom: 24,
      background: '#f8fbff',
    }}>
      <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>
        Anthropic APIキー
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-ant-xxxxxxxxxxxxx"
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '8px 12px', fontSize: 13,
          border: '1px solid #ddd', borderRadius: 6,
          fontFamily: 'monospace',
        }}
      />
      <p style={{ fontSize: 11, color: '#999', margin: '6px 0 0' }}>
        APIキーは console.anthropic.com で取得できます。このサービスには保存されません。
      </p>
    </div>
  );
}