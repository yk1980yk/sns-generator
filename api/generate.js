// IPアドレスごとの使用回数を記録する
const usageMap = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // IPアドレスを取得
  const ip = req.headers['x-forwarded-for'] || 'unknown';

  // 今日の日付を取得（例：2026-03-22）
  const today = new Date().toISOString().split('T')[0];
  const key = `${ip}-${today}`;

  // 使用回数をチェック
  const count = usageMap.get(key) || 0;
  if (count >= 5) {
    return res.status(429).json({ error: '1日の無料利用回数（5回）に達しました。明日また使えます。' });
  }

  // 使用回数を増やす
  usageMap.set(key, count + 1);

  const { platform, tone, theme } = req.body;

  if (!theme || !platform || !tone) {
    return res.status(400).json({ error: 'platform・tone・themeは必須です' });
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
      callClaude(prompt),
      callClaude(prompt),
      callClaude(prompt),
    ]);

    // 残り回数を返す
    const remaining = 5 - (count + 1);
    return res.status(200).json({ posts: results, remaining });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: '生成に失敗しました。もう一度お試しください。' });
  }
}

async function callClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
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