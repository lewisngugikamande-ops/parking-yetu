const { MockIssuer, MockResolver } = require('./MockAdapter');
const { JWTIssuer, JWTResolver } = require('./JWTAdapter');
const { DatabasePermissionResolver, MockPermissionResolver } = require('./PermissionResolver');

module.exports = {
  MockIssuer,
  MockResolver,
  JWTIssuer,
  JWTResolver,
  DatabasePermissionResolver,
  MockPermissionResolver,
};
