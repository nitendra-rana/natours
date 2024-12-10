exports.decodeJwtToken = (authorization = undefined) => {
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return null;
  }
  return token;
};
