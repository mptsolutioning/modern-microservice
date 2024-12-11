db = db.getSiblingDB('users');

db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    { role: 'readWrite', db: 'users' },
    { role: 'dbAdmin', db: 'users' }
  ]
});