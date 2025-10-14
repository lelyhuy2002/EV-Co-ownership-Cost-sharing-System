"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { mockApi } from "@/lib/mockApi";
import { useUserGroups } from "@/hooks/useUserGroups";
import { apiService } from "@/lib/api";

export default function CreateGroupPage() {
  const router = useRouter();
  const { user } = useUserGroups();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [region, setRegion] = useState("");
  const [purpose, setPurpose] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [priceRange, setPriceRange] = useState("");
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [estimatedValue, setEstimatedValue] = useState<string>("");
  const [status, setStatus] = useState<'recruiting' | 'active' | 'closed'>("recruiting");
  const [selfOwnershipPct, setSelfOwnershipPct] = useState<number>(10);
  const [memberEmailInput, setMemberEmailInput] = useState("");
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMemberEmail = () => {
    const email = memberEmailInput.trim();
    if (!email) return;
    if (memberEmails.includes(email)) return;
    setMemberEmails([...memberEmails, email]);
    setMemberEmailInput("");
  };

  const removeMemberEmail = (email: string) => {
    setMemberEmails(memberEmails.filter(e => e !== email));
  };

  const downloadContractTemplate = () => {
    const content = `Hợp đồng đồng sở hữu xe điện\n\nTên nhóm: ${groupName || '(chưa đặt)'}\nXe: ${vehicleName} ${vehicleModel}\nKhu vực: ${region}\nTỷ lệ sở hữu của chủ nhóm: ${selfOwnershipPct}%\nThành viên mời: ${memberEmails.join(', ')}\nGiá trị ước tính: ${estimatedValue}\nMục đích: ${purpose}\nQuy tắc: ${rules}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ev-co-ownership-contract-template.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Form submitted!");
    
    if (submitting) {
      console.log("⏳ Already submitting...");
      return;
    }
    
    // Validation
    console.log("📋 Validating fields:", {
      vehicleId,
      groupName,
      description,
      estimatedValue
    });
    
    if (!vehicleId || !groupName || !description || !estimatedValue) {
      console.error("❌ Validation failed - missing required fields");
      setError("Vui lòng điền đầy đủ thông tin: Tên nhóm, Mô tả, ID Xe và Giá trị ước tính");
      alert("⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setError(null);
    setSubmitting(true);
    console.log("✅ Validation passed, starting submission...");
    
    try {
      // Lấy userId từ localStorage
      let userId: number;
      const storedUser = localStorage.getItem('currentUser');
      console.log("👤 Current user from localStorage:", storedUser);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.userId || parsedUser.id;
        console.log("✅ User ID found:", userId);
      } else if (user?.id) {
        userId = typeof user.id === 'number' ? user.id : parseInt(user.id);
        console.log("✅ User ID from context:", userId);
      } else {
        console.error("❌ No user ID found!");
        setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        alert("⚠️ Vui lòng đăng nhập lại!");
        setSubmitting(false);
        return;
      }

      // Gọi API thực từ backend
      const requestData = {
        vehicleId: Number.parseInt(String(vehicleId) || '0'),
        groupName: groupName,
        description: description,
        estimatedValue: Number.parseFloat(String(estimatedValue) || '0'),
        maxMembers: Number(maxMembers || 0),
        minOwnershipPercentage: Number(selfOwnershipPct || 0)
      };

      console.log("📡 Calling API with data:", requestData, "userId:", userId);

      // Call backend via apiService
      const response = await apiService.createGroup(requestData, userId);
      console.log("📥 API Response:", response);

      // Kiểm tra message để xác định thực sự thành công hay không
      const isActualSuccess = response.success && 
        !response.message.includes("thuộc nhóm khác") &&
        !response.message.includes("chờ duyệt") &&
        !response.message.includes("Lỗi");
      
      if (isActualSuccess) {
        alert(response.message || "Tạo nhóm thành công!");
        console.log("✅ Group created successfully!");
        router.push('/groups');
      } else {
        console.error("❌ API returned error:", response.message);
        setError(response.message || "Không tạo được nhóm");
        alert("❌ " + response.message);
      }
    } catch (err: any) {
      console.error("💥 Exception caught:", err);
      const errorMsg = err.message || "Không tạo được nhóm. Vui lòng thử lại.";
      setError(errorMsg);
      alert("❌ " + errorMsg);
    } finally {
      setSubmitting(false);
      console.log("🏁 Submission finished");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Tạo nhóm mới</h1>
          <Link href="/groups" className={styles.backLink}>Hủy</Link>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${(step-1)/(3-1)*100}%` }} />
          </div>
          <div className={styles.progressSteps}>
            <span className={`${styles.stepDot} ${step>=1?styles.active:''}`}>1</span>
            <span className={`${styles.stepDot} ${step>=2?styles.active:''}`}>2</span>
            <span className={`${styles.stepDot} ${step>=3?styles.active:''}`}>3</span>
          </div>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {step === 1 && (
          <div className={styles.form}>
            <p className={styles.subtitle}>Bước 1: Thông tin chung</p>
            <div className={styles.fieldRow}>
              <label className={styles.label}>Tên nhóm</label>
              <input className={styles.input} value={groupName} onChange={(e)=>setGroupName(e.target.value)} placeholder="VD: EV Shared Hanoi" />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.label}>Mô tả</label>
              <textarea className={`${styles.input} ${styles.textarea}`} maxLength={255} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Mô tả ngắn về nhóm" />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.label}>Quy tắc nhóm</label>
              <textarea className={`${styles.input} ${styles.textarea}`} maxLength={500} value={rules} onChange={(e)=>setRules(e.target.value)} placeholder="Ví dụ: Lịch sử dụng, bảo dưỡng, trách nhiệm…" />
            </div>
            <div className={styles.actions}>
              <button className={styles.primaryBtn} onClick={()=>setStep(2)}>Tiếp tục</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <p className={styles.subtitle}>Bước 2: Chọn xe & Tỷ lệ</p>
            <div className={styles.fieldRow}>
              <label className={styles.label}>ID Xe <span className={styles.required}>*</span></label>
              <input 
                className={styles.input} 
                type="number"
                value={vehicleId} 
                onChange={(e)=>setVehicleId(e.target.value)} 
                placeholder="Nhập ID xe (bắt buộc)" 
                required 
              />
              <small style={{color: '#64748b', fontSize: '12px'}}>ID xe từ hệ thống quản lý xe của bạn</small>
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.label}>Tên xe</label>
              <input className={styles.input} value={vehicleName} onChange={(e)=>setVehicleName(e.target.value)} placeholder="Ví dụ: Tesla Model 3" />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.label}>Phiên bản</label>
              <input className={styles.input} value={vehicleModel} onChange={(e)=>setVehicleModel(e.target.value)} placeholder="Standard Range / Eco / ..." />
            </div>
            <div className={styles.grid2}>
              <div className={styles.fieldRow}>
                <label className={styles.label}>Khu vực</label>
                <input className={styles.input} value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="Hà Nội / TP.HCM / ..." />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label}>Số thành viên tối đa</label>
                <input className={styles.input} type="number" min={2} max={12} value={maxMembers} onChange={(e)=>setMaxMembers(parseInt(e.target.value||"4",10))} />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldRow}>
                <label className={styles.label}>Tỷ lệ sở hữu của bạn (%)</label>
                <input className={styles.input} type="number" min={1} max={100} value={selfOwnershipPct} onChange={(e)=>setSelfOwnershipPct(Math.max(1, Math.min(100, parseInt(e.target.value||'0',10))))} />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label}>Giá trị ước tính (VND)</label>
                <input className={styles.input} type="number" min={0} step="0.01" value={estimatedValue} onChange={(e)=>setEstimatedValue(e.target.value)} placeholder="VD: 350000000" />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.label}>Mời thành viên (Email)</label>
              <div className={styles.tagInputRow}>
                <input className={styles.input} value={memberEmailInput} onChange={(e)=>setMemberEmailInput(e.target.value)} placeholder="Nhập email rồi nhấn Thêm" />
                <button type="button" className={styles.secondaryBtn} onClick={addMemberEmail}>Thêm</button>
              </div>
              <div className={styles.chipsRow}>
                {memberEmails.map(email => (
                  <span key={email} className={styles.chip}>{email}<button type="button" onClick={()=>removeMemberEmail(email)}>×</button></span>
                ))}
              </div>
            </div>

            <div className={styles.vizRow}>
              <div className={styles.donutWrap}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="18" fill="none" />
                  {(() => {
                    const pct = Math.max(0, Math.min(100, selfOwnershipPct));
                    const circumference = 2 * Math.PI * 50;
                    const dash = (pct / 100) * circumference;
                    return (
                      <circle cx="60" cy="60" r="50" stroke="#6366f1" strokeWidth="18" fill="none"
                        strokeDasharray={`${dash} ${circumference-dash}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    );
                  })()}
                </svg>
                <div className={styles.donutLabel}>{selfOwnershipPct}% bạn</div>
              </div>
              <div className={styles.summaryBox}>
                <div>Phần còn lại: {Math.max(0, 100 - selfOwnershipPct)}%</div>
                <div>Thành viên mời: {memberEmails.length}</div>
                <button type="button" className={styles.linkBtn} onClick={downloadContractTemplate}>Xem hợp đồng mẫu</button>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={()=>setStep(1)}>Quay lại</button>
              <button className={styles.primaryBtn} onClick={()=>setStep(3)}>Tiếp tục</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <p className={styles.subtitle}>Bước 3: Xác nhận & Hoàn tất</p>
            <div className={styles.summaryGrid}>
              <div><strong>Tên nhóm:</strong> {groupName || '(chưa đặt)'}</div>
              <div><strong>ID Xe:</strong> {vehicleId || '(chưa có)'}</div>
              <div><strong>Xe:</strong> {vehicleName || '—'} {vehicleModel}</div>
              <div><strong>Khu vực:</strong> {region || '—'}</div>
              <div><strong>Tối đa:</strong> {maxMembers} thành viên</div>
              <div><strong>Mục đích:</strong> {purpose || '—'}</div>
              <div><strong>Mô tả:</strong> {description || '—'}</div>
              <div><strong>Giá trị ước tính:</strong> {estimatedValue ? `${parseFloat(estimatedValue).toLocaleString()} VND` : '—'}</div>
              <div><strong>Tỷ lệ của bạn:</strong> {selfOwnershipPct}%</div>
              <div><strong>Thành viên mời:</strong> {memberEmails.length ? memberEmails.join(', ') : '—'}</div>
              <div><strong>Trạng thái khi tạo:</strong> Chờ Admin xét duyệt</div>
            </div>
            {(!vehicleId || !groupName || !description || !estimatedValue) && (
              <div style={{padding: '12px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', marginTop: '16px'}}>
                <strong style={{color: '#92400e'}}>⚠️ Thiếu thông tin bắt buộc:</strong>
                <ul style={{margin: '8px 0 0 20px', color: '#92400e'}}>
                  {!vehicleId && <li>ID Xe</li>}
                  {!groupName && <li>Tên nhóm</li>}
                  {!description && <li>Mô tả</li>}
                  {!estimatedValue && <li>Giá trị ước tính</li>}
                </ul>
              </div>
            )}
            <div className={styles.actions}>
              <button type="button" className={styles.secondaryBtn} onClick={()=>setStep(2)}>Quay lại</button>
              <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                {submitting ? "Đang gửi yêu cầu…" : "Tạo nhóm"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}


