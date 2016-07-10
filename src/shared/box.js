export function makeBOM(box, features, productId) {
  if (!features.reduce((p, f)=>p || f == productId, false)) return box;
  return [productId, ...box.slice(1, 3).filter(b=>b != productId)].slice(0, 3);
}

export function addToBox(box, productId) {
  if (box.reduce((p, b)=> p || b == productId, false)) return box;
  if (box.length === 0) box = new Array(1);
  return [...box, productId].slice(0, 3);
}

export function removeFromBox(box, productId) {
  if (box[0] == productId) return box;
  return [box[0], ...box.slice(1, 3).filter(b=>b != productId)];
}

export function addToSwag(swag, productId) {
  if (swag.length > 3 || swag.reduce((p, s)=> p || s == productId, false)) return swag;
  return [...swag, productId];
}

export function removeFromSwag(swag, productId) {
  return swag.filter(s=>s != productId);
}