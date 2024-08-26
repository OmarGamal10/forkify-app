import { TIMEOUT_SEC } from './config';

export async function getJSON(url) {
  try {
    const res = await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}
export async function sendJSON(url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}
//utilities
export function transformObjectSnakeToCamel(obj) {
  const keys = Object.keys(obj);
  const vals = Object.values(obj);
  const newKeys = keys.map(key =>
    key.includes('_') ? snakeToCamel(key) : key.toLowerCase()
  );
  const newObject = {};
  newKeys.forEach((k, i) => {
    newObject[k] = vals[i];
  });
  return newObject;
}
function snakeToCamel(key) {
  return key
    .split('_')
    .map((word, i) => {
      if (i === 0) {
        return word.toLowerCase();
      } else {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join('');
}
function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}
