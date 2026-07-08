// ==========================================
// DIGITAL TWIN ENGINE - With Themes
// ==========================================

import parking from './parking.js';
import buildings from './buildings.js';

class DigitalTwinEngine {
    constructor() {
        this.parking = parking;
        this.buildings = buildings;
        this.isInitialized = false;
        this.organizationId = 'church_a';
        this.theme = 'church';
        this.state = {
            totalSessions: 0,
            activeSessions: 0,
            capacity: 0,
            occupancy: 0
        };
    }

    init(organizationId = 'church_a', theme = 'church') {
        if (this.isInitialized) return;
        this.organizationId = organizationId;
        this.theme = theme;
        console.log(`🏗️ Digital Twin Engine initializing for: ${organizationId} (theme: ${theme})`);

        let parkingOk = false;
        let buildingsOk = false;

        try {
            if (this.parking && typeof this.parking.init === 'function') {
                parkingOk = this.parking.init(organizationId);
                console.log(`🅿️ Parking init ${parkingOk ? '✅ succeeded' : '❌ failed'}`);
            }
        } catch (e) {
            console.warn('Parking init error:', e.message);
        }

        try {
            if (this.buildings && typeof this.buildings.init === 'function') {
                buildingsOk = this.buildings.init(organizationId, theme);
                console.log(`🏢 Buildings init ${buildingsOk ? '✅ succeeded' : '❌ failed'}`);
            } else if (this.buildings && typeof this.buildings.setTheme === 'function') {
                this.buildings.setTheme(theme);
                buildingsOk = true;
            }
        } catch (e) {
            console.warn('Buildings init error:', e.message);
        }

        // Only mark as initialized if both children succeeded
        this.isInitialized = parkingOk && buildingsOk;
        
        if (this.isInitialized) {
            console.log('✅ Digital Twin Engine fully initialized');
        } else {
            console.warn('⚠️ Digital Twin Engine partially initialized (parking:', parkingOk, 'buildings:', buildingsOk, ')');
        }
        
        return this.isInitialized;
    }

    updateOrganization(organizationId, theme = 'church') {
        this.organizationId = organizationId;
        this.theme = theme;
        console.log(`🔄 Digital Twin updating to: ${organizationId} (theme: ${theme})`);
        
        if (this.parking && typeof this.parking.updateOrganization === 'function') {
            this.parking.updateOrganization(organizationId);
        }
        
        if (this.buildings && typeof this.buildings.setTheme === 'function') {
            this.buildings.setTheme(theme);
        }
    }

    setTheme(theme) {
        this.theme = theme;
        if (this.buildings && typeof this.buildings.setTheme === 'function') {
            this.buildings.setTheme(theme);
        }
    }

    addSession(data) {
        this.state.totalSessions++;
        this.state.activeSessions++;
        
        if (this.parking && typeof this.parking.handleEntry === 'function') {
            this.parking.handleEntry(data);
        }
        
        if (this.buildings && typeof this.buildings.reactToEntry === 'function') {
            this.buildings.reactToEntry(data);
        }
        
        this.updateState();
        console.log(`🚗 Session added. Active: ${this.state.activeSessions}`);
    }

    removeSession(data) {
        this.state.activeSessions = Math.max(0, this.state.activeSessions - 1);
        
        if (this.parking && typeof this.parking.handleExit === 'function') {
            this.parking.handleExit(data);
        }
        
        if (this.buildings && typeof this.buildings.reactToExit === 'function') {
            this.buildings.reactToExit(data);
        }
        
        this.updateState();
        console.log(`🚗 Session removed. Active: ${this.state.activeSessions}`);
    }

    updateState() {
        this.state.capacity = this.parking?.config?.capacity || 0;
        this.state.occupancy = this.state.capacity > 0 
            ? Math.round((this.state.activeSessions / this.state.capacity) * 100) 
            : 0;
    }

    getState() {
        return {
            ...this.state,
            organizationId: this.organizationId,
            theme: this.theme,
            isInitialized: this.isInitialized
        };
    }

    destroy() {
        if (this.parking && typeof this.parking.destroy === 'function') {
            this.parking.destroy();
        }
        this.isInitialized = false;
        console.log('🗑️ Digital Twin destroyed');
    }
}

// Create and export singleton
const digitalTwin = new DigitalTwinEngine();

// Auto-init when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                digitalTwin.init('org_pcea_langata', 'church');
            }, 1000);
        });
    } else {
        setTimeout(() => {
            digitalTwin.init('org_pcea_langata', 'church');
        }, 1000);
    }
}

export default digitalTwin;
