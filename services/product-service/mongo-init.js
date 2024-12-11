db = db.getSiblingDB('products');

db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    { role: 'readWrite', db: 'products' },
    { role: 'dbAdmin', db: 'products' }
  ]
});