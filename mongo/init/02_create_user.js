let user = {
  user: 'demo',
  pwd: '1qazxsw2',
  roles: [{
    role: 'readWrite',
    db: 'blog'
  }]
};
db.createUser(user);
