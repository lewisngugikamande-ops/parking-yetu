class AccessEngine {
  constructor(options = {}) {
    console.log('🏗️ AccessEngine constructor called');
    this.identityRepo = options.identityRepository;
    this.credentialRepo = options.credentialRepository;
    this.membershipRepo = options.membershipRepository;
    this.policyRepo = options.policyRepository;
    this.sessionRepo = options.sessionRepository;
    this.eventBus = options.eventBus;
    this.logger = options.logger || console;
  }

  async process(request) {
    const { credential, accessPointId, action, organizationId, metadata } = request;
    
    console.log('📥 Engine processing:', { credential, accessPointId, action, organizationId });

    try {
      // Step 1: Find the credential
      const foundCredential = await this.credentialRepo.findByValue(credential.value);
      if (!foundCredential) {
        console.log('❌ Credential not found:', credential.value);
        return { success: false, error: 'Credential not found', decision: 'deny' };
      }
      console.log('✅ Credential found:', foundCredential.id);

      // Step 2: Get the identity
      const identity = await this.identityRepo.findById(foundCredential.identityId);
      if (!identity) {
        console.log('❌ Identity not found:', foundCredential.identityId);
        return { success: false, error: 'Identity not found', decision: 'deny' };
      }
      console.log('✅ Identity found:', identity.id);

      // Step 3: Get membership
      const membership = await this.membershipRepo.findByIdentityAndOrganization(
        identity.id,
        organizationId
      );
      if (!membership) {
        console.log('❌ Membership not found for:', identity.id, organizationId);
        return { success: false, error: 'Membership not found', decision: 'deny' };
      }
      console.log('✅ Membership found:', membership.id, 'roles:', membership.roles);

      // Step 4: Get policies
      console.log(`🔍 Looking for policies for organization: ${organizationId}`);
      const policies = await this.policyRepo.findByOrganization(organizationId);
      console.log(`📋 Policies found: ${policies ? policies.length : 0}`);
      
      if (policies && policies.length > 0) {
        console.log('📋 Policy details:');
        policies.forEach((p, i) => {
          console.log(`  Policy ${i + 1}: id=${p.id}, name=${p.name}`);
        });
      } else {
        console.log('⚠️ No policies found for organization:', organizationId);
      }

      // Step 5: Evaluate policies
      let allowed = false;
      for (const policy of (policies || [])) {
        console.log(`🔍 Evaluating policy: ${policy.name} (${policy.id})`);
        for (const rule of (policy.rules || [])) {
          console.log(`  📜 Rule: effect=${rule.effect}, actions=${JSON.stringify(rule.actions)}`);
          
          const actionMatches = rule.actions.includes('*') || rule.actions.includes(action);
          if (!actionMatches) {
            console.log(`  ❌ Action '${action}' not in ${JSON.stringify(rule.actions)}`);
            continue;
          }
          console.log(`  ✅ Action '${action}' matches`);
          
          if (rule.conditions && rule.conditions.roles) {
            const roleMatches = membership.roles.some(role => 
              rule.conditions.roles.includes(role)
            );
            if (!roleMatches) {
              console.log(`  ❌ Roles ${JSON.stringify(membership.roles)} don't match ${JSON.stringify(rule.conditions.roles)}`);
              continue;
            }
            console.log(`  ✅ Role match`);
          }
          
          if (rule.effect === 'allow') {
            console.log(`  ✅ ALLOW: ${action} allowed`);
            allowed = true;
            break;
          }
        }
        if (allowed) break;
      }

      if (!allowed) {
        console.log('❌ No matching policy found');
        return { success: false, error: 'No matching policy found', decision: 'deny' };
      }

      console.log('✅ Access granted!');

      // Step 6: Create session
      const session = {
        id: 'session_' + Date.now(),
        identityId: identity.id,
        credentialId: foundCredential.id,
        organizationId: organizationId,
        accessPointId: accessPointId,
        action: action,
        metadata: metadata,
        status: 'active',
        entryTime: new Date(),
        vehiclePlate: metadata?.vehicle?.licensePlate || 'Unknown'
      };

      await this.sessionRepo.save(session);
      console.log('📝 Session created:', session.id);

      // Emit event - safely check if eventBus exists and has emit
      if (this.eventBus && typeof this.eventBus.emit === 'function') {
        try {
          await this.eventBus.emit('session:started', { 
            sessionId: session.id, 
            identityId: identity.id 
          });
          console.log('📤 Event emitted: session:started');
        } catch (e) {
          console.warn('⚠️ Event emission failed:', e.message);
        }
      } else {
        console.log('ℹ️ No eventBus available, skipping event emission');
      }

      return {
        success: true,
        decision: 'allow',
        sessionId: session.id,
        identityId: identity.id,
        events: []
      };

    } catch (error) {
      console.error('❌ Engine error:', error.message);
      return { success: false, error: error.message, decision: 'deny' };
    }
  }
}

module.exports = AccessEngine;
