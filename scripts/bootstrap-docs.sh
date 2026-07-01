#!/usr/bin/env bash

# ==========================================
# Parking Yetu - Documentation Bootstrap
# Version: ${DOC_VERSION}
# ==========================================

set -Eeuo pipefail
IFS=$'\n\t'

# ==========================================
# Configuration
# ==========================================

DOC_VERSION="3.1.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$SCRIPT_DIR/..")"

# ==========================================
# Colors
# ==========================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# ==========================================
# Error Handling
# ==========================================

on_error() {
    echo ""
    echo -e "${RED}❌ Script failed on line ${BASH_LINENO[0]}${NC}"
    exit 1
}

cleanup() {
    echo ""
    echo -e "${BLUE}📚 Documentation setup complete${NC}"
}

trap on_error ERR
trap cleanup EXIT

# ==========================================
# Dependency Checks
# ==========================================

check_dependency() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo -e "${RED}❌ $1 not installed${NC}"
        echo "   Please install: $2"
        exit 1
    fi
}

# Only check tools we actually use
check_dependency "git" "sudo apt install git"
check_dependency "find" "sudo apt install findutils"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   📚 Parking Yetu - Documentation Setup${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# ==========================================
# Check existing docs
# ==========================================

cd "$PROJECT_ROOT"

if [ -d "docs" ] && [ "$(ls -1 docs/*.md 2>/dev/null | wc -l)" -gt 0 ]; then
    EXISTING_DOCS=$(ls -1 docs/*.md 2>/dev/null | wc -l)
    echo -e "${YELLOW}📁 Existing docs directory found${NC}"
    echo "   Docs: $EXISTING_DOCS files"
    echo ""
    read -p "⚠️  This will create missing files. Continue? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Cancelled${NC}"
        exit 0
    fi
fi

mkdir -p docs docs/adr

# ==========================================
# Helper function for creating files
# ==========================================

create_if_missing() {
    local file="$1"
    
    if [[ -f "$file" ]]; then
        echo -e "${YELLOW}⏭️  $file already exists${NC}"
        return 0
    fi
    
    cat > "$file"
    echo -e "${GREEN}✅ $file created${NC}"
}

# ==========================================
# 1. Generate docs/README.md (Auto-generated)
# ==========================================

echo ""
echo -e "${BLUE}📝 Generating documentation index...${NC}"

create_if_missing docs/README.md << 'EOF'
# Parking Yetu Documentation

## Overview

This documentation defines the complete specification for Parking Yetu, an enterprise parking operations platform.

## Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 00 | [Introduction](00-introduction.md) | Overview of the platform |
| 01 | [Product Vision](01-product-vision.md) | Why the product exists |
| 02 | [Business Requirements](02-business-requirements.md) | What the product does |
| 03 | [System Architecture](03-system-architecture.md) | How it's structured |
| 04 | [Data Model](04-data-model.md) | What the data looks like |
| 05 | [Administrator Guide](05-administrator-guide.md) | How admins use it |
| 06 | [User Roles](06-user-roles.md) | Who can do what |
| 07 | [User Flows](07-user-flows.md) | How users interact |
| 08 | [API Contracts](08-api-contracts.md) | How components communicate |
| 09 | [Firestore Schema](09-firestore-schema.md) | Database schema |
| 10 | [Security Model](10-security-model.md) | How security is enforced |
| 11 | [Glossary](11-glossary.md) | Shared vocabulary |
| 12 | [State Diagrams](12-state-diagrams.md) | State transitions |
| 13 | [Deployment Guide](13-deployment.md) | How to deploy |
| 14 | [Operational Runbook](14-runbook.md) | How to operate |
| 15 | [Product Roadmap](15-roadmap.md) | What comes next |

## Architecture Decision Records

| ADR | Title |
|-----|-------|
| [ADR-001](adr/ADR-001-firebase.md) | Use Firebase as Backend |
| [ADR-002](adr/ADR-002-domain-driven.md) | Domain-Driven Design |
| [ADR-003](adr/ADR-003-repository-pattern.md) | Repository Pattern |
| [ADR-004](adr/ADR-004-multi-tenant.md) | Multi-Tenant Architecture |
| [ADR-005](adr/ADR-005-firestore.md) | Use Firestore as Primary Database |

---

*Parking Yetu Documentation - Version 3.1.0*
EOF

# ==========================================
# 2. Create all documentation files
# ==========================================

echo ""
echo -e "${BLUE}📝 Creating documentation files...${NC}"

# 00-introduction.md
create_if_missing docs/00-introduction.md << 'EOF'
# Parking Yetu - Introduction

## Purpose

Parking Yetu is an enterprise parking operations platform designed for organizations that require secure, accountable, and efficient vehicle access management.

## Scope

This documentation defines the complete specification for Parking Yetu, including:
- Product vision and business requirements
- System architecture and design decisions
- Domain and data models
- User roles and workflows
- Security model and compliance
- Deployment and operations

## Audience

| Audience | Use |
|----------|-----|
| **Engineers** | Build and maintain the system |
| **Testers** | Validate functionality |
| **Product Managers** | Plan features and roadmap |
| **Administrators** | Operate the platform |
| **Security Teams** | Review security and compliance |

---

*Parking Yetu Documentation - Version 3.1.0*
EOF

# 01-product-vision.md
create_if_missing docs/01-product-vision.md << 'EOF'
# Parking Yetu - Product Vision

## Mission

Help gated organizations run secure, organized, and accountable parking operations.

## Core Values

| Value | Description |
|-------|-------------|
| **Security** | Every vehicle is tracked, every action is logged |
| **Accountability** | Complete audit trail for all operations |
| **Simplicity** | Easy for drivers, intuitive for guards |
| **Reliability** | Works when you need it most |
| **Scalability** | Grows from one location to hundreds |

## Target Organizations

- Churches
- Businesses
- Schools
- Residential Complexes
- Event Venues

## Success Metrics

| Metric | Target |
|--------|--------|
| Customer Satisfaction | >90% |
| System Uptime | >99.9% |
| Entry Processing Time | <5 seconds |
| Exit Processing Time | <10 seconds |
| Audit Completeness | 100% |

---

*Parking Yetu - Product Vision - Version 3.1.0*
EOF

# 02-business-requirements.md
create_if_missing docs/02-business-requirements.md << 'EOF'
# Parking Yetu - Business Requirements

## BR-001 Vehicle Registration

**Requirement:** The platform shall allow authorized users to register vehicles entering premises.

**Acceptance Criteria:**
- License plate is required
- Driver name is required
- Driver phone is required
- Entry timestamp is recorded
- Entry gate is recorded
- QR code is generated
- Audit log is created

## BR-002 Vehicle Exit

**Requirement:** The platform shall allow security personnel to process vehicle exits.

**Acceptance Criteria:**
- Exit via QR scan or manual plate entry
- Exit time is recorded
- Duration is calculated
- Session status changes to EXITED
- Audit log is created

## BR-003 QR Code Generation

**Requirement:** The platform shall generate unique QR codes for each entry.

## BR-004 Security Login

**Requirement:** Security personnel shall log in to the security module.

## BR-005 Real-time Dashboard

**Requirement:** The platform shall provide a real-time dashboard.

## BR-006 User Management

**Requirement:** Administrators shall manage system users.

## BR-007 Role-Based Access Control

**Requirement:** The platform shall enforce role-based access.

## BR-008 Audit Logging

**Requirement:** The platform shall log all critical actions.

## BR-009 VIP Management

**Requirement:** The platform shall support VIP vehicle identification.

## BR-010 Multi-location Support

**Requirement:** The platform shall support multiple locations.

## BR-011 Overstay Detection

**Requirement:** The platform shall detect and flag overstays.

---

*Parking Yetu - Business Requirements - Version 3.1.0*
EOF

# 03-system-architecture.md
create_if_missing docs/03-system-architecture.md << 'EOF'
# Parking Yetu - System Architecture

## Architecture Layers

