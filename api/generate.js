export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform, tone, theme, apiKey } = req.body;

  if (!theme || !platform || !tone) {
    return res.status(400).json({ error: 'platform・tone・themeは必須です' });
  }

  if (!apiKey) {
    return res.status(400).json({ error: 'APIキーを入力してください' });
  }

  const charLimits = {
    'X（Twitter）': '140字以内',
    'Instagram':    '300字前後、改行を活用',
    'LinkedIn':     '500字前後、ビジネス向け',
    'Threads':      '500字以内',
  };
  const limit = charLimits[platform] ?? '300字前後';

  const prompt = `あなたはSNSマーケターです。
プラットフォーム: ${platform}
トーン: ${tone}
文字数: ${limit}
テーマ: ${theme}

上記の条件でSNS投稿文を1つ作成してください。
絵文字とハッシュタグ（2〜3個）を含めてください。
投稿文のみ出力してください。説明や前置きは不要です。`;

  try {
    const results = await Promise.all([
      callClaude(prompt, apiKey),
      callClaude(prompt, apiKey),
      callClaude(prompt, apiKey),
    ]);

    return res.status(200).json({ posts: results });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'APIキーが正しくないか、残高が不足しています' });
  }
}

async function callClaude(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.[0]?.text ?? '';
}