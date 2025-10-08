"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import mockApi from '@/lib/mockApi';
import Header from '@/components/Header/Header';
import styles from './schedule.module.css';

type Booking = {
  id: string;
  groupId: string;
  userId: string;
  slot: { 
    date: string; 
    start: string; 
    end?: string; 
    endDate?: string;
    endTimeExpected?: string;
    notes?: string 
  };
  status: string;
  createdAt: string;
};

export default function GroupSchedulePage() {
  const params = useParams() as { id?: string };
  const groupId = params?.id ?? 'unknown';
  const router = useRouter();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [endDate, setEndDate] = useState('');
  const [endTimeExpected, setEndTimeExpected] = useState('10:00');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [usages, setUsages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [groupInfo, setGroupInfo] = useState<any | null>(null);
  const [monthCursor, setMonthCursor] = useState<Date>(() => new Date());
  const [expanded, setExpanded] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiChecking, setAiChecking] = useState(false);
  const [barsReady, setBarsReady] = useState(false);
  const [newUserId, setNewUserId] = useState<string>('');
  const [aiStatus, setAiStatus] = useState<null | { type: 'ok' | 'conflict'; note: string }>(null);
  const [smartSlots, setSmartSlots] = useState<Array<{ date: string; start: string; end: string }>>([]);
  const [dragging, setDragging] = useState<null | { date: string; startMin: number; endMin: number }>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMeta, setConfirmMeta] = useState<{ hasConflict: boolean; conflictWith?: string }>({ hasConflict: false });
  const [batteryPercent, setBatteryPercent] = useState<number>(28);

  const currentUserId = useMemo(() => {
    if (typeof window === 'undefined') return 'user-002';
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null')?.id ?? 'user-002'; } catch { return 'user-002'; }
  }, []);

  useEffect(() => {
    (async () => {
      const [b, u, m, gs] = await Promise.all([
        mockApi.getBookingsForGroup(groupId),
        mockApi.getUsageHistory({ groupId }),
        mockApi.getGroupMembers(groupId),
        mockApi.getGroups()
      ]);
      setBookings(b || []);
      setUsages(u || []);
      setMembers(m || []);
      setGroupInfo((gs || []).find((g:any) => g.id === groupId) || null);
      // reset/animate bars after data loads
      setBarsReady(false);
      setTimeout(() => setBarsReady(true), 240);
    })();
  }, [groupId]);

  const exportCSV = async () => {
    const rows = await mockApi.getUsageHistory({ groupId });
    const csv = ['id,bookingId,ts,distanceKm,durationMin,cost'].concat(rows.map((r:any)=>`${r.id},${r.bookingId},${r.ts},${r.usage.distanceKm||''},${r.usage.durationMin||''},${r.usage.cost||''}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `usage_${groupId}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const monthDays = useMemo(() => {
    const days: string[] = [];
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      const d = new Date(y, m, i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, [monthCursor]);

  const weekDays = useMemo(() => {
    const days: string[] = [];
    const base = new Date();
    const day = base.getDay(); // 0=Sun
    const mondayOffset = ((day + 6) % 7); // 0 for Monday
    const monday = new Date(base);
    monday.setDate(base.getDate() - mondayOffset);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d.toISOString().slice(0,10));
    }
    return days;
  }, []);

  const displayedDays = expanded ? monthDays : weekDays;

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const d of displayedDays) map[d] = [];
    bookings.forEach(b => {
      if (!map[b.slot.date]) map[b.slot.date] = [];
      map[b.slot.date].push(b);
    });
    return map;
  }, [bookings, displayedDays]);

  const getMember = (id: string) => members.find(m => m.id === id) || { id, name: id, percent: 0, color: '#9ca3af' };

  // Tính toán số ngày tối đa được đặt dựa trên % sở hữu
  const getMaxBookingDays = (ownershipPercent: number) => {
    // Công thức: % sở hữu * 30 ngày (tối đa 1 tháng)
    // Tối thiểu 1 ngày, tối đa 30 ngày
    return Math.max(1, Math.min(30, Math.round(ownershipPercent * 0.3)));
  };

  const toMinutes = (t: string) => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };

  const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    return Math.max(toMinutes(aStart), toMinutes(bStart)) < Math.min(toMinutes(aEnd), toMinutes(bEnd));
  };

  const roundToStep = (minutes: number, step = 30) => {
    return Math.round(minutes / step) * step;
  };

  const toHHMM = (minutes: number) => {
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    const h = String(Math.max(0, Math.min(23, hh))).padStart(2, '0');
    const m = String(Math.max(0, Math.min(59, mm))).padStart(2, '0');
    return `${h}:${m}`;
  };

  const computeSmartSlots = (targetDate: string, desiredStart: string, desiredEnd: string) => {
    const dayBookings = (bookingsByDate[targetDate] || []).filter(b => b.status === 'confirmed');
    const occupied: Array<[number, number]> = dayBookings
      .map(b => [toMinutes(b.slot.start), toMinutes(b.slot.end || b.slot.start)] as [number, number])
      .sort((a,b)=>a[0]-b[0]);
    const desired = [toMinutes(desiredStart), toMinutes(desiredEnd)] as [number, number];
    const duration = Math.max(30, desired[1] - desired[0]);
    const open: Array<[number, number]> = [];
    let cursor = 0;
    for (const [s,e] of occupied) {
      if (s - cursor >= 30) open.push([cursor, s]);
      cursor = Math.max(cursor, e);
    }
    if (24*60 - cursor >= 30) open.push([cursor, 24*60]);
    const candidates: Array<{ date: string; start: string; end: string; score: number }> = [];
    for (const [s,e] of open) {
      for (let t = roundToStep(Math.max(s, desired[0]-120)); t + duration <= e; t += 30) {
        const gap = Math.abs(t - desired[0]);
        candidates.push({ date: targetDate, start: toHHMM(t), end: toHHMM(t + duration), score: gap });
        if (candidates.length > 80) break;
      }
    }
    candidates.sort((a,b)=>a.score-b.score);
    return candidates.slice(0,3).map(({date,start,end})=>({date,start,end}));
  };

  const handleCreateBooking = async () => {
    setMessage(null);
    setAiStatus(null);
    if (!date) { setMessage('Vui lòng chọn ngày bắt đầu.'); return; }
    if (!endDate) { setMessage('Vui lòng chọn ngày kết thúc dự kiến.'); return; }
    if (!endTime) { setMessage('Vui lòng chọn giờ kết thúc.'); return; }
    if (!endTimeExpected) { setMessage('Vui lòng chọn giờ kết thúc dự kiến.'); return; }
    
    // Kiểm tra ngày bắt đầu không được trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(date);
    if (startDate < today) {
      setMessage('Ngày bắt đầu không được trong quá khứ.');
      return;
    }
    
    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    const endDateObj = new Date(endDate);
    if (endDateObj < startDate) {
      setMessage('Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }
    
    // Kiểm tra số ngày đặt không vượt quá giới hạn
    const bookingUserId = newUserId || currentUserId;
    const currentMember = members.find(m => m.id === bookingUserId) || { percent: 0 };
    const maxDays = getMaxBookingDays(currentMember.percent);
    const daysDiff = Math.ceil((endDateObj.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (daysDiff > maxDays) {
      setMessage(`Bạn chỉ được đặt tối đa ${maxDays} ngày (dựa trên ${currentMember.percent}% sở hữu).`);
      return;
    }
    // AI priority check animation
    setAiChecking(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      // run conflict logic
      const existing = await mockApi.getBookingsForGroup(groupId);
      const overlap = existing.find((b: any) => b.slot.date === date && b.status === 'confirmed' && b.slot.start && b.slot.end && timesOverlap(startTime, endTime, b.slot.start, b.slot.end));
      if (overlap) {
        const membersList: any[] = await mockApi.getGroupMembers(groupId);
        const bookingUserId = newUserId || currentUserId;
        const currentMember = membersList.find((m:any) => m.id === bookingUserId) || { percent: 0 };
        const ownerOfConflict = membersList.find((m:any) => m.id === overlap.userId) || { percent: 0 };
        if (currentMember.percent > ownerOfConflict.percent) {
          setMessage(`Xung đột: ${overlap.userId} đã đặt trước nhưng ưu tiên của bạn cao hơn. Vui lòng xác nhận để thay thế lịch.`);
          setAiStatus({ type: 'ok', note: 'AI: Đặt lịch khả thi. Quyền ưu tiên được xác nhận.' });
          setConfirmMeta({ hasConflict: true, conflictWith: ownerOfConflict.name || overlap.userId });
          setConfirmOpen(true);
        } else {
          setMessage('Xung đột lịch: thời gian này đã có người đặt. Vui lòng chọn thời gian khác.');
          setAiStatus({ type: 'conflict', note: 'AI: Cảnh báo Xung đột Lịch. Thành viên khác có quyền ưu tiên cao hơn.' });
          setSmartSlots(computeSmartSlots(date, startTime, endTime));
        }
        return;
      }
      // No conflicts -> open confirmation modal to review
      await new Promise(r => setTimeout(r, 550));
      setAiStatus({ type: 'ok', note: 'AI: Đặt lịch khả thi. Quyền ưu tiên được xác nhận.' });
      setConfirmMeta({ hasConflict: false });
      setConfirmOpen(true);
    } catch (err) {
      console.error(err);
      setMessage('Lỗi khi kiểm tra lịch.');
    } finally {
      setAiChecking(false);
    }
  };


  // Personal analysis: compute user's total duration vs group total (simple aggregation)
  const personalAnalysis = useMemo(() => {
    const userUsages = usages.filter(u => {
      const b = bookings.find((bb:any) => bb.id === u.bookingId);
      return b && b.userId === currentUserId;
    });
    const userMinutes = userUsages.reduce((s, u) => s + (u.usage.durationMin || 0), 0);
    const totalMinutes = usages.reduce((s, u) => s + (u.usage.durationMin || 0), 0) || 1;
    const pct = Math.round((userMinutes / totalMinutes) * 100);
    const myPercent = (members.find(m => m.id === currentUserId)?.percent) || 0;
    return { userMinutes, totalMinutes, pct, myPercent };
  }, [usages, bookings, members, currentUserId]);

  const handleSmartPick = (s: { date: string; start: string; end: string }) => {
    setDate(s.date);
    setStartTime(s.start);
    setEndTime(s.end);
    setEndDate(s.date);
    setEndTimeExpected(s.end);
    setAiStatus(null);
  };

  const handleDayMouseDown = (day: string, e: React.MouseEvent<HTMLDivElement>) => {
    const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const y = e.clientY - box.top;
    const minutes = Math.max(0, Math.min(24*60, roundToStep((y / box.height) * 24 * 60)));
    setDragging({ date: day, startMin: minutes, endMin: minutes + 30 });
  };

  const handleDayMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const y = e.clientY - box.top;
    const minutes = Math.max(0, Math.min(24*60, roundToStep((y / box.height) * 24 * 60)));
    setDragging(prev => prev ? { ...prev, endMin: Math.max(prev.startMin + 30, minutes) } : prev);
  };

  const handleDayMouseUp = () => {
    if (!dragging) return;
    const selDate = dragging.date;
    const s = Math.min(dragging.startMin, dragging.endMin);
    const eMin = Math.max(dragging.startMin, dragging.endMin);
    const sHH = toHHMM(s);
    const eHH = toHHMM(eMin);
    setDate(selDate);
    setStartTime(sHH);
    setEndTime(eHH);
    setEndDate(selDate);
    setEndTimeExpected(eHH);
    setPanelOpen(true);
    setDragging(null);
  };

  return (
    <>
      <Header headerHidden={false} currentSection={2} goToSection={() => {}} />
      <main className={styles.container}>
        <div className={styles.mainArea}>
          <h1 className={styles.title}>Lịch nhóm — {groupId}</h1>
          <div className={styles.calendarHeader}>
            {expanded ? (
              <>
                <button className={styles.navBtn} onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}>← Tháng trước</button>
                <div className={styles.monthTitle}>
                  {monthCursor.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className={styles.navBtn} onClick={() => setExpanded(false)}>Thu gọn (7 ngày)</button>
                  <button className={styles.navBtn} onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}>Tháng sau →</button>
                </div>
              </>
            ) : (
              <>
                <div />
                <div className={styles.monthTitle}>
                  Tuần này: {weekDays[0]} → {weekDays[6]}
                </div>
                <button className={styles.navBtn} onClick={() => setExpanded(true)}>Mở rộng (tháng)</button>
              </>
            )}
          </div>

          <div className={styles.weekHeader}>
            {['T2','T3','T4','T5','T6','T7','CN'].map((w) => (
              <div key={w} className={styles.weekName}>{w}</div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div className={styles.memberLegend}>
            {members.map(m => (
              <div key={m.id} className={styles.legendItem}>
                <div className={styles.legendSwatch} style={{ background: m.color }} />
                <div className={styles.memberName}>{m.name} <span style={{ fontWeight: 600, marginLeft: 6 }}>({m.percent}%)</span></div>
              </div>
            ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={styles.exportBtn} onClick={() => exportCSV()}>Export CSV</button>
              <button className={styles.primaryBtn} onClick={() => setPanelOpen(true)}>Đặt Lịch Mới</button>
            </div>
          </div>

          <div className={styles.weekGrid}>
            {expanded && (() => {
              const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
              const firstWeekday = (first.getDay() + 6) % 7; // Monday=0
              const blanks = Array.from({ length: firstWeekday });
              return blanks.map((_, i) => <div key={'blank-'+i} className={styles.dayColumn + ' ' + styles.emptyDay}></div>);
            })()}
            {displayedDays.map(d => (
              <div key={d} className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  {new Date(d).toLocaleDateString('vi-VN', { weekday: 'short' })}
                  <span className={styles.dayBadge + (new Date().toISOString().slice(0,10) === d ? ' ' + styles.todayBadge : '')}>
                    {new Date(d).getDate()}
                  </span>
                </div>
                <div 
                  className={styles.dayBody}
                  onMouseDown={(e) => handleDayMouseDown(d, e)}
                  onMouseMove={handleDayMouseMove}
                  onMouseUp={handleDayMouseUp}
                >
                  {(bookingsByDate[d] || []).map(b => {
                    const mem = getMember(b.userId);
                    const statusClass = b.status === 'in-use' ? styles.statusInUse : (b.status === 'bumped' ? styles.statusBumped : styles.statusConfirmed);
                    const bgClass = b.status === 'in-use' ? 'bookingInUseBg' : 'bookingConfirmedBg';
                    const own = Math.max(0, Math.min(100, mem.percent || 0));
                    const ring = `conic-gradient(from 0deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))`;
                    return (
                      <div 
                        id={'booking-' + b.id}
                        key={b.id}
                        className={styles.bookingCard + ' ' + styles[bgClass]}
                        style={{ 
                          borderLeft: `6px solid ${mem.color || '#6b7280'}`, 
                          position: 'relative',
                          boxShadow: `0 6px ${Math.round(own/8)}px rgba(0,0,0,${0.05 + own/800})`,
                          outline: `2px solid rgba(102,126,234,${0.05 + own/300})`,
                          outlineOffset: '0px'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className={styles.bookingTop}>
                            <div className={styles.bookingTime}>
                              {b.slot.start}{b.slot.end ? ` - ${b.slot.end}` : ''}
                              {b.slot.endDate && (
                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                  Đến: {new Date(b.slot.endDate).toLocaleDateString('vi-VN')} {b.slot.endTimeExpected}
                                </div>
                              )}
                            </div>
                            <div className={`${styles.bookingStatus} ${statusClass}`}>{b.status}</div>
                          </div>
                          <div className={styles.bookingUser} style={{ color: mem.color }}>{mem.name}</div>
                        </div>

                        <div className={styles.bookingTooltip} style={{ right: 12 }}>
                          Người đặt: {mem.name} ({mem.percent}%)
                        </div>
                      </div>
                    );
                  })}
                  {dragging && dragging.date === d && (
                    <div 
                      className={styles.dragSelection}
                      style={{ 
                        top: `${(Math.min(dragging.startMin, dragging.endMin) / (24*60)) * 100}%`,
                        height: `${(Math.abs(dragging.endMin - dragging.startMin) / (24*60)) * 100}%`
                      }}
                    >
                      <span className={styles.dragLabel}>{toHHMM(Math.min(dragging.startMin, dragging.endMin))} - {toHHMM(Math.max(dragging.startMin, dragging.endMin))}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <section className={styles.usageSection}>
            <h2>Lịch sử sử dụng</h2>
            <table className={styles.usageTable}>
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Ngày</th>
                  <th>Quãng đường</th>
                  <th>Thời lượng</th>
                  <th>Chi phí</th>
                  <th>Trạng thái thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {usages.map(u => {
                  const booking = bookings.find((b:any) => b.id === u.bookingId) as Booking | undefined;
                  const owner = booking ? getMember(booking.userId) : { name: u.usage.recordedBy || 'Unknown' };
                  return (
                    <tr key={u.id}>
                      <td>{owner.name}</td>
                      <td>{new Date(u.ts).toLocaleString()}</td>
                      <td>{u.usage.distanceKm ?? '—'} km</td>
                      <td>{u.usage.durationMin ?? '—'} min</td>
                      <td>{u.usage.cost ? `${u.usage.cost.toLocaleString()}đ` : '—'}</td>
                      <td>{u.usage.paid ? 'Paid' : 'Unpaid'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Đặt xe</h3>
            <div className={styles.field}>
              <label>Ngày bắt đầu</label>
              <input 
                className={styles.input} 
                type="date" 
                value={date} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)} 
              />
            </div>
            <div className={styles.field}>
              <label>Giờ bắt đầu</label>
              <input className={styles.input} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Ngày kết thúc dự kiến</label>
              <input 
                className={styles.input} 
                type="date" 
                value={endDate} 
                min={date || new Date().toISOString().split('T')[0]}
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
            <div className={styles.field}>
              <label>Giờ kết thúc dự kiến</label>
              <input className={styles.input} type="time" value={endTimeExpected} onChange={e => setEndTimeExpected(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Giờ kết thúc thực tế</label>
              <input className={styles.input} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
            <div className={styles.field}>
              <small className={styles.note}>
                Lưu ý: Quyền ưu tiên có thể áp dụng dựa trên tỷ lệ sở hữu của bạn. 
                Số ngày tối đa được đặt: {getMaxBookingDays((members.find(m => m.id === currentUserId)?.percent) || 0)} ngày.
              </small>
            </div>
            <div className={styles.field}>
              <label>Trạng thái pin hiện tại (%)</label>
              <input className={styles.input} type="number" min={0} max={100} value={batteryPercent} onChange={e => setBatteryPercent(Math.max(0, Math.min(100, Number(e.target.value)||0)))} />
            </div>
            <button className={styles.primaryBtn} onClick={handleCreateBooking}>Đặt ngay</button>
            {message && <div className={styles.message}>{message}</div>}
            {aiStatus && (
              <div className={aiStatus.type === 'ok' ? styles.aiOk : styles.aiWarn}>
                {aiStatus.note}
              </div>
            )}
            {aiStatus?.type === 'conflict' && smartSlots.length > 0 && (
              <div className={styles.smartSlotBox}>
                <div className={styles.smartTitle}>Gợi ý khung giờ tốt nhất</div>
                <div className={styles.smartSlots}>
                  {smartSlots.map((s, i) => (
                    <button key={i} className={styles.smartBtn} onClick={() => handleSmartPick(s)}>
                      {new Date(s.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      <span>{s.start} - {s.end}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <button className={styles.exportBtn} onClick={async () => {
                const rows = await mockApi.getUsageHistory({ groupId });
                const csv = ['id,bookingId,ts,distanceKm,durationMin,cost'].concat(rows.map((r:any)=>`${r.id},${r.bookingId},${r.ts},${r.usage.distanceKm||''},${r.usage.durationMin||''},${r.usage.cost||''}`)).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `usage_${groupId}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}>Export usage (.csv)</button>
            </div>
          </div>


          <div className={styles.card}>
            <h3>Thành viên & Tỷ lệ</h3>
            <div className={styles.memberListSidebar}>
              {members.map(m => (
                <div key={m.id} className={styles.memberRowSidebar}>
                  <div className={styles.avatarSmall} style={{ background: m.color }}>{m.name[0]}</div>
                  <div>
                    <div className={styles.memberName}>{m.name}</div>
                    <div className={styles.memberPct}>{m.percent}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.card}>
              <h4>Phân tích cá nhân — so sánh</h4>
              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Sở hữu (%)</div>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: barsReady ? `${personalAnalysis.myPercent}%` : '0%', background: '#94a3ff' }} /></div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Thời gian sử dụng (%)</div>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: barsReady ? `${personalAnalysis.pct}%` : '0%', background: '#60a5fa' }} /></div>
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Tổng thời gian bạn: {personalAnalysis.userMinutes} phút — Nhóm tổng: {personalAnalysis.totalMinutes} phút</div>
              </div>
            </div>

            <div className={styles.card}>
              <h4>Xe hiện tại — SoC</h4>
              <div className={styles.socBox}>
                <div className={styles.socTrack}><div className={styles.socFill} style={{ width: `${batteryPercent}%` }} /></div>
                <div className={styles.socMeta}>Pin còn lại: {batteryPercent}%</div>
                <div className={styles.socWarn}>Pin thấp. Đề nghị sạc trước khi Check-out.</div>
                {/* Check-out button (enabled only for current user's active booking) */}
                <button 
                  className={styles.primaryBtn}
                  onClick={async () => {
                    try {
                      const userId = currentUserId;
                      const todays = bookings.filter((b:any) => b.userId === userId && b.status === 'confirmed');
                      if (todays.length === 0) return;
                      const active = todays[todays.length - 1];
                      await mockApi.updateBookingStatus(active.id, 'in-use');
                      await mockApi.recordUsage(active.id, { recordedBy: userId, distanceKm: 0, durationMin: 0, cost: 0 });
                      setBookings(prev => prev.map(b => b.id === active.id ? { ...b, status: 'in-use' } : b));
                    } catch (e) { console.error(e); }
                  }}
                  disabled={!bookings.some((b:any) => b.userId === currentUserId && b.status === 'confirmed')}
                >
                  Check-out
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

        {/* Slide-in panel for booking creation */}
        <div className={`${styles.slidePanel} ${panelOpen ? styles.openPanel : ''}`} aria-hidden={!panelOpen}>
          <div className={styles.panelContent}>
            <h3>Đặt Lịch Mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label>Ngày bắt đầu</label>
              <input 
                className={styles.input} 
                type="date" 
                value={date} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)} 
              />
              <label>Giờ bắt đầu</label>
              <input className={styles.input} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              <label>Ngày kết thúc dự kiến</label>
              <input 
                className={styles.input} 
                type="date" 
                value={endDate} 
                min={date || new Date().toISOString().split('T')[0]}
                onChange={e => setEndDate(e.target.value)} 
              />
              <label>Giờ kết thúc dự kiến</label>
              <input className={styles.input} type="time" value={endTimeExpected} onChange={e => setEndTimeExpected(e.target.value)} />
              <label>Giờ kết thúc thực tế</label>
              <input className={styles.input} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              <label>Người dùng</label>
              <select className={styles.input} value={newUserId} onChange={e => setNewUserId(e.target.value)}>
                <option value="">(Bạn)</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Số ngày tối đa được đặt: {getMaxBookingDays((members.find(m => m.id === (newUserId || currentUserId))?.percent) || 0)} ngày
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.primaryBtn} onClick={handleCreateBooking} disabled={aiChecking}>
                  {aiChecking ? <span className={styles.spinner}><span className={styles.spinnerDot}></span></span> : 'Xác nhận'}
                </button>
                <button className={styles.secondaryBtn} onClick={() => setPanelOpen(false)}>Hủy</button>
              </div>
              {aiChecking && <div style={{ color: 'var(--muted)' }}>AI đang kiểm tra quyền ưu tiên...</div>}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmOpen && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalCardXL}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  {confirmMeta.hasConflict ? 'Review Đặt Lịch & Quyền Ưu Tiên' : 'Đặt Lịch Thành Công!'}
                </div>
                <button className={styles.secondaryBtn} onClick={() => setConfirmOpen(false)}>Đóng</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.summaryGrid}>
                  <div className={styles.confirmCard}>
                    <div className={styles.cardIcon}>⏰</div>
                    <div>
                      <div className={styles.cardLabel}>Thời gian</div>
                      <div className={styles.cardValue}>{date} → {endDate || date}</div>
                      <div className={styles.cardValue} style={{ marginTop: 2 }}>{startTime} - {endTimeExpected || endTime}</div>
                    </div>
                  </div>
                  <div className={styles.confirmCard}>
                    <div className={styles.cardIcon}>👤</div>
                    <div>
                      <div className={styles.cardLabel}>Người đặt</div>
                      <div className={styles.cardValue}>{(members.find(m => m.id === (newUserId || currentUserId))?.name) || '(Bạn)'} — {members.find(m => m.id === (newUserId || currentUserId))?.percent ?? 0}%</div>
                      <div className={styles.cardSub}>% pin hiện tại: {batteryPercent}%</div>
                    </div>
                  </div>
                  <div className={styles.confirmCard}>
                    <div className={styles.cardIcon}>🚗</div>
                    <div>
                      <div className={styles.cardLabel}>Xe</div>
                      <div className={styles.cardValue}>{groupInfo?.vehicleName || 'EV'} {groupInfo?.vehicleModel ? `· ${groupInfo.vehicleModel}` : ''}</div>
                      <div className={styles.cardSub}>Biển số: —</div>
                    </div>
                  </div>
                </div>

                <div className={styles.timelineBox}>
                  <div className={styles.timelineTrack}>
                    <div 
                      className={styles.timelineFill}
                      style={{
                        left: `${(toMinutes(startTime)/1440)*100}%`,
                        width: `${((toMinutes(endTimeExpected || endTime) - toMinutes(startTime))/1440)*100}%`
                      }}
                    />
                  </div>
                </div>

                <div className={confirmMeta.hasConflict ? styles.aiCardWarn : styles.aiCardOk}>
                  <div className={styles.aiCardTitle}>
                    {confirmMeta.hasConflict ? 'Trạng thái: Xung đột Đã Được Giải Quyết' : 'Trạng thái: Đã Xác nhận'}
                  </div>
                  <div className={styles.aiCardSub}>
                    {confirmMeta.hasConflict 
                      ? `Hệ thống sẽ thay thế lịch của thành viên ${(confirmMeta.conflictWith || '')} dựa trên quyền ưu tiên.`
                      : 'Lịch của bạn được đảm bảo do tuân thủ quy tắc và quyền ưu tiên.'}
                  </div>
                  <div className={styles.aiCostLine}>Dự kiến chi phí (sạc & hao mòn): ~150.000 VNĐ</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                <button className={styles.ghostBtn} onClick={() => {
                  // Simple ICS export
                  try {
                    const dt = `${date}T${startTime.replace(':','')}00`; const de = `${endDate || date}T${(endTimeExpected || endTime).replace(':','')}00`;
                    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${Date.now()}@evco\nDTSTAMP:${dt}Z\nDTSTART:${dt}Z\nDTEND:${de}Z\nSUMMARY:Đặt lịch nhóm ${groupId}\nDESCRIPTION:${groupInfo?.vehicleName || 'EV'}\nEND:VEVENT\nEND:VCALENDAR`;
                    const blob = new Blob([ics], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `booking_${groupId}.ics`; a.click(); URL.revokeObjectURL(url);
                  } catch {}
                }}>Thêm vào lịch (ICS)</button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className={styles.secondaryBtn} onClick={() => { setConfirmOpen(false); setPanelOpen(true); }}>Nhập lại</button>
                  <button className={styles.bigPrimaryBtn} onClick={async () => {
                  try {
                    const bookingUserId = newUserId || currentUserId;
                    // If there is a conflict we approved, replace any overlapping booking now
                    const existing = await mockApi.getBookingsForGroup(groupId);
                    const overlap = existing.find((b: any) => b.slot.date === date && b.status === 'confirmed' && b.slot.start && b.slot.end && timesOverlap(startTime, endTime, b.slot.start, b.slot.end));
                    let booking: any;
                    if (overlap) {
                      booking = await mockApi.replaceBooking(overlap.id, { groupId, userId: bookingUserId, slot: { date, start: startTime, end: endTime, endDate, endTimeExpected } });
                    } else {
                      booking = await mockApi.createBooking(groupId, bookingUserId, { date, start: startTime, end: endTime, endDate, endTimeExpected });
                    }
                    setBookings(prev => [...prev, booking as Booking]);
                    setDate(''); setStartTime('09:00'); setEndTime('10:00'); setEndDate(''); setEndTimeExpected('10:00');
                    setPanelOpen(false);
                    setConfirmOpen(false);
                    setMessage('Đặt thành công.');
                  } catch (e) {
                    console.error(e);
                    setMessage('Lỗi khi đặt lịch.');
                  }
                  }}>Xác nhận đặt lịch</button>
                </div>
              </div>
            </div>
          </div>
        )}

    </>
  );
}
