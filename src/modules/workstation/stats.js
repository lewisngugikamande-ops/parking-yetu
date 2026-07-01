// ============================================
// Stats Management - Permanent Fix
// ============================================

import { getSessionRepository } from '../../repositories/session-repository.js';
import { config } from '../../config/index.js';
import { updateActivityFeed } from './activity-feed.js';
import { getTodayStart, getTomorrowStart, getTimeAgo } from '../../utils/time.js';

let sessionRepo = getSessionRepository();
let activeSessions = [];
let cachedTodayCount = 0;
let lastTodayCountUpdate = 0;
const TODAY_COUNT_CACHE_TTL = 300000;

// Helper: Safe DOM updates
function safeUpdateElement(id, value, property = 'textContent') {
    const el = document.getElementById(id);
    if (el) {
        if (property === 'style') {
            Object.assign(el.style, value);
        } else {
            el[property] = value;
        }
    }
}

export async function refreshData() {
    try {
        const orgId = config.app.defaultOrganization;
        const capacity = config.parking.maxCapacity;
        
        const sessions = await sessionRepo.getActive(orgId);
        activeSessions = sessions;
        const count = sessions.length;
        
        // Update stats
        safeUpdateElement('insideCount', count);
        safeUpdateElement('availableCount', Math.max(0, capacity - count));
        
        const pct = Math.min((count / capacity) * 100, 100);
        const bar = document.getElementById('occupancyBar');
        if (bar) bar.style.width = pct + '%';
        safeUpdateElement('occupancyPercent', Math.round(pct) + '%');
        
        // Today count with caching
        const todayCount = await getTodayEntries(orgId);
        safeUpdateElement('todayCount', todayCount);
        
        // Update activity feed
        updateActivityFeed(sessions);
        updateLastActivity(sessions);

        return { sessions, count, todayCount };

    } catch (error) {
        console.error('Error refreshing data:', error);
        return null;
    }
}

function updateLastActivity(sessions) {
    const el = document.getElementById('lastActivityTime');
    if (!el) return;
    
    if (sessions.length > 0) {
        const sorted = [...sessions].sort((a, b) => 
            new Date(b.entryTime) - new Date(a.entryTime)
        );
        const latest = sorted[0];
        const entryTime = latest.entryTime ? new Date(latest.entryTime) : new Date();
        el.textContent = `🟢 Last entry: ${getTimeAgo(entryTime)}`;
    } else {
        el.textContent = '🟢 Last entry: --';
    }
}

async function getTodayEntries(organizationId) {
    const now = Date.now();
    if (now - lastTodayCountUpdate < TODAY_COUNT_CACHE_TTL) {
        return cachedTodayCount;
    }
    
    try {
        const { getDb } = await import('../../services/firebase.js');
        const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
        
        const db = getDb();
        const today = getTodayStart();
        const tomorrow = getTomorrowStart();
        
        const q = query(
            collection(db, 'parking_sessions'),
            where('organizationId', '==', organizationId),
            where('entryTime', '>=', today),
            where('entryTime', '<', tomorrow)
        );
        const snapshot = await getDocs(q);
        cachedTodayCount = snapshot.size;
        lastTodayCountUpdate = now;
        return cachedTodayCount;
    } catch (error) {
        console.error('Error getting today entries:', error);
        return 0;
    }
}

export function getActiveSessions() {
    return activeSessions;
}

export function incrementTodayCount() {
    cachedTodayCount += 1;
    lastTodayCountUpdate = Date.now();
    safeUpdateElement('todayCount', cachedTodayCount);
}
