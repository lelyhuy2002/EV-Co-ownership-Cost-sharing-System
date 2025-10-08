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
  status: 'open' | 'full' | 'pending' | 'active' | 'rejected' | 'recruiting' | 'closed';
  icon?: string;
  color?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  members?: string[]; // user ids
  // DB-aligned fields (optional in FE mock)
  groupName?: string; // CoOwnershipGroups.group_name
  description?: string; // CoOwnershipGroups.description
  estimatedValue?: number; // CoOwnershipGroups.estimated_value
  approvalStatus?: 'pending' | 'approved' | 'rejected'; // CoOwnershipGroups.approval_status
  rejectReason?: string | null; // CoOwnershipGroups.reject_reason
  vehicleId?: number | string; // CoOwnershipGroups.vehicle_id
  createdBy?: string; // CoOwnershipGroups.created_by (user id)
  approvedBy?: string | null; // CoOwnershipGroups.approved_by
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

type User = {
  id: string;
  username?: string;
  fullName?: string;
  email: string;
  role: 'admin' | 'coowner' | 'provider' | 'consumer';
  status?: 'pending' | 'active' | 'rejected';
  groups?: any[];
};

const GROUPS_KEY = 'mock_groups_v1';
const REQ_KEY = 'mock_join_requests_v1';
const USERS_KEY = 'mock_users_v1';
const LOGS_KEY = 'mock_logs_v1';
const BOOKINGS_KEY = 'mock_bookings_v1';
const USAGES_KEY = 'mock_usages_v1';

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

function loadUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const defaults: User[] = [
      { id: 'user-admin', username: 'admin', fullName: 'System Admin', email: 'admin@local', role: 'admin', status: 'active', groups: [] },
      { id: 'user-002', username: 'trb', fullName: 'Trần Thị B', email: 'trb@local', role: 'coowner', status: 'active', groups: [] }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try { return JSON.parse(raw); } catch { return []; }
}

function saveUsers(users: User[]) {
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
      status: (payload.status as any) ?? 'recruiting',
      icon: payload.icon ?? '🚗',
      color: payload.color ?? 'blue',
      rating: 4.5,
      reviewCount: 0,
      priceRange: payload.priceRange ?? 'TBD',
      members: [payload.adminId],
      groupName: payload.groupName ?? payload.vehicleName ?? 'New Group',
      description: payload.description ?? '',
      estimatedValue: payload.estimatedValue ? Number(payload.estimatedValue) : undefined,
      approvalStatus: (payload.approvalStatus as any) ?? 'pending',
      rejectReason: payload.rejectReason ?? null,
      vehicleId: payload.vehicleId,
      createdBy: payload.createdBy ?? payload.adminId,
      approvedBy: payload.approvedBy ?? null
    };
    groups.push(g);
    saveGroups(groups);
    addLog({ type: 'group.create', message: `Group ${g.id} created by ${payload.adminId}`, meta: { group: g, by: payload.adminId } });
    return g;
  },

  // Users
  getUsers: async () => {
    await new Promise(r => setTimeout(r, 100));
    return loadUsers();
  },

  createUserPending: async (payload: { username?: string; fullName?: string; email: string; password: string; role?: User['role']; profile?: any }) => {
    const users = loadUsers();
    const id = uid('user-');
    const u: User & { profile?: any } = {
      id,
      username: payload.username || payload.email,
      fullName: payload.fullName || payload.username || payload.email,
      email: payload.email,
      role: payload.role || 'coowner',
      status: 'pending',
      groups: [],
      profile: payload.profile || {}
    };
    users.push(u);
    saveUsers(users);
    addLog({ type: 'user.register', message: `User ${u.id} registered pending approval`, meta: { user: u } });
    return u;
  },

  getUserById: async (id: string) => {
    const users = loadUsers();
    return users.find((u:any) => u.id === id) || null;
  },

  approveUser: async (userId: string) => {
    const users = loadUsers();
    const idx = users.findIndex((u:User) => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx].status = 'active';
    saveUsers(users);
    addLog({ type: 'user.approve', message: `User ${userId} approved`, meta: { userId } });
    return users[idx];
  },

  rejectUser: async (userId: string, reason?: string) => {
    const users = loadUsers();
    const idx = users.findIndex((u:User) => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx].status = 'rejected';
    saveUsers(users);
    addLog({ type: 'user.reject', message: `User ${userId} rejected: ${reason || ''}`, meta: { userId, reason } });
    return users[idx];
  },

  // Existing join request APIs...
  getJoinRequests: async (filter?: { status?: string }) => {
    await new Promise(r => setTimeout(r, 150));
    const reqs = loadRequests();
    if (filter?.status) return reqs.filter(q => q.status === filter.status);
    return reqs;
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

  approveJoinRequest: async (requestId: string) => {
    const reqs = loadRequests();
    const idx = reqs.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Not found');
    reqs[idx].status = 'approved';
    saveRequests(reqs);

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

// Booking & Usage helpers (unchanged)
function loadBookings() {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  if (!raw) { localStorage.setItem(BOOKINGS_KEY, JSON.stringify([])); return []; }
  try { return JSON.parse(raw); } catch { return []; }
}
function saveBookings(b: any[]) { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(b)); }

function loadUsages() {
  const raw = localStorage.getItem(USAGES_KEY);
  if (!raw) { localStorage.setItem(USAGES_KEY, JSON.stringify([])); return []; }
  try { return JSON.parse(raw); } catch { return []; }
}
function saveUsages(u: any[]) { localStorage.setItem(USAGES_KEY, JSON.stringify(u)); }

mockApi.createBooking = async (groupId: string, userId: string, slot: { date: string; start: string; end?: string; notes?: string }) => {
  const bookings = loadBookings();
  const b = { id: uid('bk-'), groupId, userId, slot: { ...slot }, status: 'confirmed', createdAt: new Date().toISOString() };
  bookings.push(b);
  saveBookings(bookings);
  addLog({ type: 'booking.create', message: `Booking ${b.id} created for ${userId} in ${groupId}`, meta: { booking: b } });
  return b;
};

mockApi.getBookingsForGroup = async (groupId: string) => {
  await new Promise(r => setTimeout(r, 80));
  const bookings = loadBookings();
  return bookings.filter((b:any) => b.groupId === groupId);
};

mockApi.getBookingsForUser = async (userId: string) => {
  await new Promise(r => setTimeout(r, 80));
  const bookings = loadBookings();
  return bookings.filter((b:any) => b.userId === userId);
};

mockApi.updateBookingStatus = async (bookingId: string, status: string) => {
  const bookings = loadBookings();
  const idx = bookings.findIndex((b:any) => b.id === bookingId);
  if (idx === -1) throw new Error('booking not found');
  bookings[idx].status = status;
  saveBookings(bookings);
  addLog({ type: 'booking.update', message: `Booking ${bookingId} status -> ${status}`, meta: { bookingId, status } });
  return bookings[idx];
};

mockApi.replaceBooking = async (oldBookingId: string, newBooking: any) => {
  await mockApi.updateBookingStatus(oldBookingId, 'bumped');
  return await mockApi.createBooking(newBooking.groupId, newBooking.userId, newBooking.slot);
};

mockApi.recordUsage = async (bookingId: string, usage: { distanceKm?: number; durationMin?: number; cost?: number; recordedBy?: string }) => {
  const usages = loadUsages();
  const entry = { id: uid('usg-'), bookingId, ts: new Date().toISOString(), usage };
  usages.unshift(entry);
  saveUsages(usages);
  addLog({ type: 'usage.record', message: `Usage recorded for booking ${bookingId}`, meta: { entry } });
  return entry;
};

mockApi.getUsageHistory = async (filter?: { userId?: string; groupId?: string }) => {
  await new Promise(r => setTimeout(r, 80));
  let usages = loadUsages();
  if (filter?.userId) {
    const bookings = loadBookings().filter((b:any) => b.userId === filter.userId).map((b:any) => b.id);
    usages = usages.filter((u:any) => bookings.includes(u.bookingId));
  }
  if (filter?.groupId) {
    const bookings = loadBookings().filter((b:any) => b.groupId === filter.groupId).map((b:any) => b.id);
    usages = usages.filter((u:any) => bookings.includes(u.bookingId));
  }
  return usages;
};

mockApi.getGroupMembers = async (groupId: string) => {
  const groups = loadGroups();
  const users = loadUsers();
  const g = groups.find(x => x.id === groupId);
  if (!g || !g.members) return [];
  return g.members.map((uid:any, idx:number) => {
    const u = (users as User[]).find((x:any) => x.id === uid) || { id: uid, fullName: uid };
    const memberCount = Math.max(1, (g.members && g.members.length) ? g.members.length : 1);
    return { id: (u as any).id, name: (u as any).fullName || (u as any).username || (u as any).id, percent: Math.max(5, Math.floor(100 / memberCount) ), color: ['#3b82f6','#22c55e','#f97316','#8b5cf6'][idx % 4] };
  });
};

// Package (group) management helpers for admin UI
mockApi.approvePackage = async (packageId: string) => {
  const groups = loadGroups();
  const idx = groups.findIndex(g => g.id === packageId);
  if (idx === -1) throw new Error('Package not found');
  groups[idx].status = 'active';
  // ensure uploadedDate exists
  if (!groups[idx].createdDate) groups[idx].createdDate = new Date().toLocaleDateString('vi-VN');
  saveGroups(groups);
  addLog({ type: 'package.approve', message: `Package ${packageId} approved`, meta: { packageId } });
  return groups[idx];
};

mockApi.rejectPackage = async (packageId: string, reason?: string) => {
  const groups = loadGroups();
  const idx = groups.findIndex(g => g.id === packageId);
  if (idx === -1) throw new Error('Package not found');
  groups[idx].status = 'rejected';
  saveGroups(groups);
  addLog({ type: 'package.reject', message: `Package ${packageId} rejected: ${reason || 'no reason'}`, meta: { packageId, reason } });
  return groups[idx];
};

mockApi.getLogs = async () => {
  await new Promise(r => setTimeout(r, 50));
  return loadLogs();
};

mockApi.exportReport = async (type: 'users' | 'groups' | 'requests' | 'logs') => {
  if (type === 'users') {
    const u = loadUsers();
    const csv = ['id,username,fullName,email,role,status'].concat(u.map((x:any)=>`${x.id},${x.username},${x.fullName},${x.email},${x.role},${x.status || ''}`)).join('\n');
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
export type { Group, JoinRequest, User };
