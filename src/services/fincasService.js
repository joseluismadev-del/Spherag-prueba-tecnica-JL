const API_URL = 'https://apicore.spherag.com/System/List';

export async function getFincas(token) {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {Authorization: `Bearer ${token}`},
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Error ${response.status}`);
  }

  return response.json();
}
