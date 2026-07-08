// ==========================================
// POLICY SERVICE - Evaluate access policies
// ==========================================

export class PolicyService {
    constructor() {
        // Default policies
        this.policies = [
            {
                id: 'policy_1',
                name: 'Member Access',
                roles: ['member', 'admin', 'staff'],
                actions: ['enter', 'exit'],
                resources: ['*'],
                effect: 'allow'
            },
            {
                id: 'policy_2',
                name: 'Visitor Access',
                roles: ['visitor'],
                actions: ['enter', 'exit'],
                resources: ['gate_1', 'gate_2'],
                effect: 'allow',
                conditions: {
                    maxDuration: 4 // hours
                }
            }
        ];
    }

    async evaluate(context) {
        const { credential, gate } = context;
        const role = credential?.role || 'visitor';
        const action = 'enter';
        const resource = gate?.accessPointId || 'gate_1';

        console.log(`🔍 Evaluating policy for role: ${role}, action: ${action}, resource: ${resource}`);

        // Find matching policies
        const matchingPolicies = this.policies.filter(p => {
            const roleMatch = p.roles.includes(role);
            const actionMatch = p.actions.includes(action) || p.actions.includes('*');
            const resourceMatch = p.resources.includes(resource) || p.resources.includes('*');
            return roleMatch && actionMatch && resourceMatch;
        });

        if (matchingPolicies.length === 0) {
            return {
                granted: false,
                reason: 'No matching policy found',
                policies: []
            };
        }

        // Check if any policy allows access
        const allowed = matchingPolicies.some(p => p.effect === 'allow');
        const denied = matchingPolicies.some(p => p.effect === 'deny');

        if (denied) {
            return {
                granted: false,
                reason: 'Access explicitly denied by policy',
                policies: matchingPolicies
            };
        }

        if (allowed) {
            return {
                granted: true,
                reason: 'Access granted by policy',
                policies: matchingPolicies
            };
        }

        return {
            granted: false,
            reason: 'No explicit allow policy found',
            policies: matchingPolicies
        };
    }

    async addPolicy(policy) {
        this.policies.push(policy);
        console.log(`📋 Policy added: ${policy.id}`);
        return policy;
    }

    async removePolicy(id) {
        const index = this.policies.findIndex(p => p.id === id);
        if (index === -1) return false;
        this.policies.splice(index, 1);
        console.log(`📋 Policy removed: ${id}`);
        return true;
    }

    async getPolicies() {
        return [...this.policies];
    }
}

export default new PolicyService();
