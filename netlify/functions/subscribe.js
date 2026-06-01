// Netlify Function — proxy server-side a Kit (sin CORS)
exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    }};
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405 };

  try {
    const { email, name } = JSON.parse(event.body || '{}');
    if (!email) return { statusCode: 400, body: 'Email requerido' };

    const res = await fetch('https://api.convertkit.com/v3/forms/9508596/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        api_key: 'NXIsXZzLbU5EM9WEiVy3RQ',
        email,
        first_name: name || ''
      })
    });

    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok: res.ok, id: data.subscription?.id })
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
