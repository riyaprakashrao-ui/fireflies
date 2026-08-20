const asset = (path) => {
  if (!path || typeof path !== 'string') return path;
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  const base = process.env.PUBLIC_URL || '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

export default asset;
