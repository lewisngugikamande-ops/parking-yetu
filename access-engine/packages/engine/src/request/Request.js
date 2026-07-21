const { Entity, Result } = require('@access-engine/foundation');
const RequestId = require('./RequestId');

class Request extends Entity {
  constructor(data) {
    const id = data.id instanceof RequestId ? data.id : new RequestId(data.id);
    super(id);
    
    this._identityId = data.identityId;
    this._resourceId = data.resourceId;
    this._accessPointId = data.accessPointId;
    this._action = data.action;
    this._status = data.status || 'pending';
    this._context = data.context || {};
    this._version = data.version || 0;
  }
  
  get identityId() { return this._identityId; }
  get resourceId() { return this._resourceId; }
  get accessPointId() { return this._accessPointId; }
  get action() { return this._action; }
  get status() { return this._status; }
  get context() { return { ...this._context }; }
  get version() { return this._version; }
  
  approve(approvedBy) {
    if (this._status !== 'pending') {
      return Result.err(`Cannot approve request in ${this._status} state`);
    }
    
    this._status = 'approved';
    this._approvedBy = approvedBy;
    this._approvedAt = new Date().toISOString();
    this._incrementVersion();
    
    return Result.ok(this);
  }
  
  deny(reason) {
    if (this._status !== 'pending') {
      return Result.err(`Cannot deny request in ${this._status} state`);
    }
    
    this._status = 'denied';
    this._deniedReason = reason;
    this._deniedAt = new Date().toISOString();
    this._incrementVersion();
    
    return Result.ok(this);
  }
  
  static create(data) {
    return new Request(data);
  }
  
  static restore(data) {
    return new Request({ ...data, fromRepository: true });
  }
  
  toJSON() {
    return {
      id: this._id.toString(),
      identityId: this._identityId.toString(),
      resourceId: this._resourceId.toString(),
      accessPointId: this._accessPointId.toString(),
      action: this._action,
      status: this._status,
      context: this._context,
      version: this._version
    };
  }
}

module.exports = Request;
