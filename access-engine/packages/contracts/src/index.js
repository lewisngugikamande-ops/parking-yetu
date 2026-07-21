// Repository Contracts
const IdentityRepository = require('./repositories/IdentityRepository');
const CredentialRepository = require('./repositories/CredentialRepository');
const MembershipRepository = require('./repositories/MembershipRepository');
const PolicyRepository = require('./repositories/PolicyRepository');
const SessionRepository = require('./repositories/SessionRepository');

const {
  Principal,
  AuthorizationContext,
  PrincipalResolver,
  TokenIssuer,
  PermissionResolver,
} = require('./auth');

module.exports = {
  IdentityRepository,
  CredentialRepository,
  MembershipRepository,
  PolicyRepository,
  SessionRepository,
  Principal,
  AuthorizationContext,
  PrincipalResolver,
  TokenIssuer,
  PermissionResolver,
};
