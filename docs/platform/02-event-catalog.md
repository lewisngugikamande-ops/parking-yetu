| ReportGenerated | Report created | reportId, type, orgId, generatedBy |
| ThresholdExceeded | Alert | metric, value, threshold, orgId |
| ComplianceCheckPassed | Passed | checkId, orgId, timestamp |
| ComplianceCheckFailed | Failed | checkId, orgId, reason |
| InsightDiscovered | New insight | insightId, type, data |

---

## Event Flow Patterns

### Synchronous Flow (Immediate Response)
```
QRScanned → IdentityResolved → PolicyEvaluated → AccessGranted/AccessDenied
```

### Asynchronous Flow (Background Processing)
```
AccessGranted → SessionStarted → VehicleParked → BuildingOccupancyChanged
```

### Notification Flow (Alerting)
```
AccessDenied → ThresholdExceeded → Alert → Notification
```

---

## Event Storage

Events are stored in `audit_logs` table with:

- event_name
- event_version
- payload (JSON)
- occurred_at
- correlation_id (trace across events)
- source_module
- user_id
- organization_id

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-07 | 1.0.0 | Initial event catalog |
