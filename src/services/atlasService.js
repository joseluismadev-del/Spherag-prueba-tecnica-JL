const BASE_URL = 'https://apicore.spherag.com/systems';

export async function getAtlasList(token, fincaId, init = 1, limit = 10) {
  const url = `${BASE_URL}/${fincaId}/Atlas/?Init=${init}&Limit=${limit}`;
  console.log('=== ATLAS LIST URL ===', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {Authorization: `Bearer ${token}`},
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.log('=== ATLAS LIST ERROR ===', response.status, text);
    throw new Error(text || `Error ${response.status}`);
  }

  const json = await response.json();
  console.log('=== ATLAS LIST RESPONSE ===', JSON.stringify(json, null, 2));
  return json;
}

export async function getAtlasDetail(token, fincaId, imei) {
  const url = `${BASE_URL}/${fincaId}/Atlas/${imei}`;
  console.log('=== ATLAS DETAIL URL ===', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {Authorization: `Bearer ${token}`},
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.log('=== ATLAS DETAIL ERROR ===', response.status, text);
    throw new Error(text || `Error ${response.status}`);
  }

  const json = await response.json();
  console.log('=== ATLAS DETAIL RESPONSE ===', JSON.stringify(json, null, 2));
  return json;
}
