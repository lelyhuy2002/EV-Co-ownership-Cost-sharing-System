// Simple front-end mock API using localStorage to simulate backend for demo purposes
type Group = {
  id: string;
  vehicleName: string;
  vehicleModel?: string;
  currentMembers: number;
  maxMembers: number;
  ownershipAvailable: number;
  region?: string;
  purpose?: string;
  createdDate: string;
  adminId?: string;
  adminName?: string;
  status: 'open' | 'full';
  icon?: string;
  color?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  members?: string[]; // user ids
};

type JoinRequest = {
  id: string;
  groupId: string;
  userId: string;
  userName?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

const GROUPS_KEY = 'mock_groups_v1';
const REQ_KEY = 'mock_join_requests_v1';
const USERS_KEY = 'mock_users_v1';
const LOGS_KEY = 'mock_logs_v1';

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function loadGroups(): Group[] {
  const raw = localStorage.getItem(GROUPS_KEY);
  if (!raw) {
    const defaults: Group[] = [
      {
        id: 'grp-join-01',
        vehicleName: 'Tesla Model 3',
        vehicleModel: 'Standard Range Plus',
        currentMembers: 3,
        maxMembers: 5,
        ownershipAvailable: 40,
        region: 'Hà Nội',
        purpose: 'Đi lại hàng ngày',
        createdDate: '15/01/2025',
        adminId: 'user-admin',
        adminName: 'Nguyễn Văn A',
        status: 'open',
        icon: '⚡',
        color: 'blue',
        rating: 4.8,
        reviewCount: 32,
        priceRange: '2-3M VND',
        members: ['user-admin']
      },
      {
        id: 'grp-join-02',
        vehicleName: 'VinFast VF8',
        vehicleModel: 'Eco',
        currentMembers: 2,
        maxMembers: 4,
        ownershipAvailable: 50,
        region: 'TP.HCM',
        purpose: 'Du lịch cuối tuần',
        createdDate: '20/01/2025',
        adminId: 'user-002',
        adminName: 'Trần Thị B',
        status: 'open',
        icon: '🚗',
        color: 'green',
        rating: 4.6,
        reviewCount: 28,
        priceRange: '1.5-2.5M VND',
        members: ['user-002']
      }
    ];
    localStorage.setItem(GROUPS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(raw) as Group[];
  } catch {
    return [];
  }
}

function saveGroups(groups: Group[]) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

function loadRequests(): JoinRequest[] {
  const raw = localStorage.getItem(REQ_KEY);
  if (!raw) {
    const empty: JoinRequest[] = [];
    localStorage.setItem(REQ_KEY, JSON.stringify(empty));
    return empty;
  }
  try {
    return JSON.parse(raw) as JoinRequest[];
  } catch {
    return [];
  }
}

function saveRequests(reqs: JoinRequest[]) {
  localStorage.setItem(REQ_KEY, JSON.stringify(reqs));
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const defaults = [
      { id: 'user-admin', username: 'admin', fullName: 'System Admin', email: 'admin@local', role: 'admin', groups: [] },
      { id: 'user-002', username: 'trb', fullName: 'Trần Thị B', email: 'trb@local', role: 'coowner', groups: [] }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try { return JSON.parse(raw); } catch { return []; }
}

function saveUsers(users: any[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadLogs() {
  const raw = localStorage.getItem(LOGS_KEY);
  if (!raw) { localStorage.setItem(LOGS_KEY, JSON.stringify([])); return []; }
  try { return JSON.parse(raw); } catch { return []; }
}

function saveLogs(logs: any[]) { localStorage.setItem(LOGS_KEY, JSON.stringify(logs)); }

function addLog(entry: { type: string; message: string; meta?: any }) {
  const logs = loadLogs();
  logs.unshift({ id: 'log-' + Math.random().toString(36).slice(2,9), ts: new Date().toISOString(), ...entry });
  saveLogs(logs);
}

export const mockApi: any = {
  getGroups: async (): Promise<Group[]> => {
    await new Promise(r => setTimeout(r, 200));
    return loadGroups();
  },

  createGroup: async (payload: Partial<Group> & { adminId: string; adminName: string }): Promise<Group> => {
    const groups = loadGroups();
    const g: Group = {
      id: uid('grp-'),
      vehicleName: payload.vehicleName ?? 'New Vehicle',
      vehicleModel: payload.vehicleModel,
      currentMembers: 1,
      maxMembers: payload.maxMembers ?? 6,
      ownershipAvailable: payload.ownershipAvailable ?? 100,
      region: payload.region ?? 'Unknown',
      purpose: payload.purpose ?? '',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      adminId: payload.adminId,
      adminName: payload.adminName,
      status: 'open',
      icon: payload.icon ?? '🚗',
      color: payload.color ?? 'blue',
      rating: 4.5,
      reviewCount: 0,
      priceRange: payload.priceRange ?? 'TBD',
      members: [payload.adminId]
    };
    groups.push(g);
    saveGroups(groups);
    addLog({ type: 'group.create', message: `Group ${g.id} created by ${payload.adminId}`, meta: { group: g, by: payload.adminId } });
    return g;
  },

  requestJoin: async (groupId: string, userId: string, userName?: string, message?: string) => {
    const reqs = loadRequests();
    const r: JoinRequest = {
      id: uid('req-'),
      groupId,
      userId,
      userName,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reqs.push(r);
    saveRequests(reqs);
    addLog({ type: 'join.request', message: `User ${userId} requested join ${groupId}`, meta: { request: r } });
    return r;
  },

  getJoinRequests: async (filter?: { status?: string }) => {
    await new Promise(r => setTimeout(r, 150));
    const reqs = loadRequests();
    if (filter?.status) return reqs.filter(q => q.status === filter.status);
    return reqs;
  },

  approveJoinRequest: async (requestId: string) => {
    const reqs = loadRequests();
    const idx = reqs.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Not found');
    reqs[idx].status = 'approved';
    saveRequests(reqs);

    // add user to group members
    const groups = loadGroups();
    const g = groups.find(x => x.id === reqs[idx].groupId);
    if (g) {
      if (!g.members) g.members = [];
      if (!g.members.includes(reqs[idx].userId)) {
        g.members.push(reqs[idx].userId);
        g.currentMembers = g.members.length;
        if (g.currentMembers >= g.maxMembers) g.status = 'full';
      }
      saveGroups(groups);
    }
    addLog({ type: 'join.approve', message: `Request ${requestId} approved`, meta: { requestId } });
    return reqs[idx];
  },

  rejectJoinRequest: async (requestId: string) => {
    const reqs = loadRequests();
    const idx = reqs.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Not found');
    reqs[idx].status = 'rejected';
    saveRequests(reqs);
    addLog({ type: 'join.reject', message: `Request ${requestId} rejected`, meta: { requestId } });
    return reqs[idx];
  }
};

// extend mockApi with users and logs
mockApi.getUsers = async () => {
  await new Promise(r => setTimeout(r, 100));
  return loadUsers();
};

mockApi.createUser = async (payload: any) => {
  const users = loadUsers();
  const u = { id: payload.id ?? uid('user-'), username: payload.username ?? payload.email, fullName: payload.fullName ?? payload.username, email: payload.email, role: payload.role ?? 'coowner', groups: payload.groups ?? [] };
  users.push(u);
  saveUsers(users);
  addLog({ type: 'user.create', message: `User ${u.id} created`, meta: { user: u } });
  return u;
};

mockApi.getLogs = async () => {
  await new Promise(r => setTimeout(r, 50));
  return loadLogs();
};

mockApi.exportReport = async (type: 'users' | 'groups' | 'requests' | 'logs') => {
  // simple CSV exporter
  if (type === 'users') {
    const u = loadUsers();
    const csv = ['id,username,fullName,email,role'].concat(u.map((x:any)=>`${x.id},${x.username},${x.fullName},${x.email},${x.role}`)).join('\n');
    return { filename: 'users.csv', content: csv };
  }
  if (type === 'groups') {
    const g = loadGroups();
    const csv = ['id,vehicleName,currentMembers,maxMembers,region,adminName'].concat(g.map((x:any)=>`${x.id},"${x.vehicleName}",${x.currentMembers},${x.maxMembers},"${x.region}","${x.adminName}"`)).join('\n');
    return { filename: 'groups.csv', content: csv };
  }
  if (type === 'requests') {
    const r = loadRequests();
    const csv = ['id,groupId,userId,userName,status,createdAt'].concat(r.map(x=>`${x.id},${x.groupId},${x.userId},${x.userName || ''},${x.status},${x.createdAt}`)).join('\n');
    return { filename: 'requests.csv', content: csv };
  }
  if (type === 'logs') {
    const l = loadLogs();
    const csv = ['id,ts,type,message'].concat(l.map((x:any)=>`${x.id},${x.ts},${x.type},"${(x.message||'').replace(/"/g,'""')}"`)).join('\n');
    return { filename: 'logs.csv', content: csv };
  }
  return { filename: 'report.csv', content: '' };
};

export default mockApi;

export type { Group, JoinRequest };
