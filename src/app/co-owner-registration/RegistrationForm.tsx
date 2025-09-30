"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./Registration.module.css";

type OwnershipEntry = {
  coOwnerName: string;
  percent: number;
};

type StepKey = 1 | 2 | 3 | 4 | 5;

export default function RegistrationForm() {
  const [step, setStep] = useState<StepKey>(1);

  // Step 1: Account
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"coowner" | "admin">("coowner");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Personal
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFrontImage, setIdFrontImage] = useState<File | null>(null);
  const [idBackImage, setIdBackImage] = useState<File | null>(null);

  // Step 3: Car & Legal
  const [driverLicenseImage, setDriverLicenseImage] = useState<File | null>(null);
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [driverLicensePreview, setDriverLicensePreview] = useState<string | null>(null);
  const [vehiclePreview, setVehiclePreview] = useState<string | null>(null);
  const [licensePlate, setLicensePlate] = useState("");

  // Step 4: Co-ownership & e-contract (optional)
  const [ownerships, setOwnerships] = useState<OwnershipEntry[]>([{ coOwnerName: "", percent: 0 }]);
  const [eContractFile, setEContractFile] = useState<File | null>(null);

  // Errors (simple real-time validation)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progressPercent = useMemo(() => {
    return Math.round(((step - 1) / 4) * 100);
  }, [step]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const idRegex = /^(\d{9}|\d{12})$/;

  // FE-only helpers and constants
  const MAX_FILE_SIZE_MB = 5;
  const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  const DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  function validateFile(file: File | null, allowed: string[], maxMB: number) {
    if (!file) return "";
    if (!allowed.includes(file.type)) return "Định dạng tệp không được hỗ trợ";
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxMB) return `Kích thước tối đa ${maxMB}MB`;
    return "";
  }

  function normalizePlate(v: string) {
    return v.toUpperCase().replace(/\s+/g, " ").trim();
  }

  // Relaxed VN plate validation (kept lenient to avoid blocking legitimate formats)
  const plateRegex = /^[0-9]{2}[A-Z0-9- ]{1,6}$/;

  // Step validity (for disabling Next button)
  const isStepValid = useMemo(() => {
    if (step === 1) {
      return (
        username.trim().length > 0 &&
        emailRegex.test(email) &&
        password.length >= 6 &&
        confirmPassword === password
      );
    }
    if (step === 2) {
      return (
        fullName.trim().length > 0 &&
        !!dob &&
        idRegex.test(idNumber) &&
        !!idFrontImage &&
        !!idBackImage
      );
    }
    if (step === 3) {
      return !!driverLicenseImage && !!vehicleImage && licensePlate.trim().length > 0;
    }
    if (step === 4) {
      // Optional step; valid if empty or totals to 100 and fields filled
      const total = ownerships.reduce((sum, o) => sum + (Number.isFinite(o.percent) ? o.percent : 0), 0);
      const hasAnyName = ownerships.some(o => o.coOwnerName.trim());
      const hasAnyPercent = ownerships.some(o => o.percent > 0);
      if (!hasAnyName && !hasAnyPercent) return true;
      if (total !== 100) return false;
      return ownerships.every(o => o.coOwnerName.trim() && o.percent >= 0 && o.percent <= 100);
    }
    return true;
  }, [step, username, email, password, confirmPassword, fullName, dob, idNumber, idFrontImage, idBackImage, driverLicenseImage, vehicleImage, licensePlate, ownerships]);

  // Image previews for step 3
  useEffect(() => {
    if (driverLicenseImage) {
      const url = URL.createObjectURL(driverLicenseImage);
      setDriverLicensePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setDriverLicensePreview(null);
  }, [driverLicenseImage]);

  useEffect(() => {
    if (vehicleImage) {
      const url = URL.createObjectURL(vehicleImage);
      setVehiclePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setVehiclePreview(null);
  }, [vehicleImage]);

  // Autosave to localStorage (except File objects)
  useEffect(() => {
    const saved = localStorage.getItem("registrationForm");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step as StepKey);
        setUsername(data.username ?? "");
        setEmail(data.email ?? "");
        setRole(data.role ?? "coowner");
        setPassword(data.password ?? "");
        setConfirmPassword(data.confirmPassword ?? "");
        setFullName(data.fullName ?? "");
        setDob(data.dob ?? "");
        setIdNumber(data.idNumber ?? "");
        setLicensePlate(data.licensePlate ?? "");
        setOwnerships(Array.isArray(data.ownerships) ? data.ownerships : [{ coOwnerName: "", percent: 0 }]);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const toSave = {
      step,
      username,
      email,
      role,
      password,
      confirmPassword,
      fullName,
      dob,
      idNumber,
      licensePlate,
      ownerships,
    };
    localStorage.setItem("registrationForm", JSON.stringify(toSave));
  }, [step, username, email, password, confirmPassword, fullName, dob, idNumber, licensePlate, ownerships]);

  function validateCurrentStep(): boolean {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!username.trim()) nextErrors.username = "Vui lòng nhập tên đăng nhập";
      if (!emailRegex.test(email)) nextErrors.email = "Email không hợp lệ";
      if (password.length < 6) nextErrors.password = "Mật khẩu tối thiểu 6 ký tự";
      if (confirmPassword !== password) nextErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (step === 2) {
      if (!fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ tên";
      if (!dob) nextErrors.dob = "Vui lòng nhập ngày sinh";
      if (!idRegex.test(idNumber)) nextErrors.idNumber = "CMND/CCCD phải 9 hoặc 12 số";
      if (!idFrontImage) nextErrors.idFrontImage = "Tải ảnh CMND/CCCD mặt trước";
      if (!idBackImage) nextErrors.idBackImage = "Tải ảnh CMND/CCCD mặt sau";
    }

    if (step === 3) {
      if (!driverLicenseImage) nextErrors.driverLicenseImage = "Tải ảnh giấy phép lái xe";
      if (!vehicleImage) nextErrors.vehicleImage = "Tải ảnh xe";
      if (!licensePlate.trim()) nextErrors.licensePlate = "Nhập biển số xe";
    }

    if (step === 4) {
      // Optional step but validate if filled
      const total = ownerships.reduce((sum, o) => sum + (Number.isFinite(o.percent) ? o.percent : 0), 0);
      const hasAnyName = ownerships.some(o => o.coOwnerName.trim());
      const hasAnyPercent = ownerships.some(o => o.percent > 0);
      if (hasAnyName || hasAnyPercent) {
        if (total !== 100) nextErrors.ownerships = "Tổng tỷ lệ sở hữu phải bằng 100%";
        ownerships.forEach((o, idx) => {
          if (!o.coOwnerName.trim()) nextErrors[`owner_${idx}_name`] = "Nhập tên đồng sở hữu";
          if (o.percent < 0 || o.percent > 100) nextErrors[`owner_${idx}_percent`] = "0-100";
        });
      }
      // eContract is optional; no strict validation here
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setStep(prev => {
      const nextStep = Math.min(5, prev + 1);
      return nextStep as StepKey;
    });
  }

  function goBack() {
    setStep(prev => {
      const prevStep = Math.max(1, prev - 1);
      return prevStep as StepKey;
    });
  }

  function handleSubmit() {
    if (!validateCurrentStep()) return;
    const payload = {
      account: { username, email },
      role,
      personal: { fullName, dob, idNumber },
      car: { licensePlate },
      ownerships,
      attachments: {
        idFrontImage: idFrontImage?.name,
        idBackImage: idBackImage?.name,
        driverLicenseImage: driverLicenseImage?.name,
        vehicleImage: vehicleImage?.name,
        eContractFile: eContractFile?.name,
      },
    };
    // TODO: send payload and files to API endpoint
    // For now, save to localStorage as current user (mock backend-less flow)
    const current = {
      id: `user-${Math.random().toString(36).slice(2, 9)}`,
      username,
      email,
      fullName,
      role,
      groups: [],
      hasGroups: false
    };
    try {
      localStorage.setItem('currentUser', JSON.stringify(current));
    } catch {
      // ignore
    }
    // eslint-disable-next-line no-alert
    alert("Đăng ký thành công! (demo) Tài khoản đã được lưu cục bộ.");
    // console.log(payload);
  }

  // Keyboard shortcuts: Enter -> next/submit, Escape -> back
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step < 5) {
          if (isStepValid) goNext();
        } else {
          handleSubmit();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (step > 1) goBack();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step, isStepValid]);

  function updateOwnershipName(index: number, name: string) {
    setOwnerships(prev => prev.map((o, i) => (i === index ? { ...o, coOwnerName: name } : o)));
  }

  function updateOwnershipPercent(index: number, percent: number) {
    setOwnerships(prev => prev.map((o, i) => (i === index ? { ...o, percent: Number.isNaN(percent) ? 0 : percent } : o)));
  }

  function addOwnerRow() {
    setOwnerships(prev => [...prev, { coOwnerName: "", percent: 0 }]);
  }

  function removeOwnerRow(index: number) {
    setOwnerships(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
      <div className={styles.header}>
        <h1>Đăng ký</h1>
        <span className={styles.badge}>Bước {step}/5 — {step === 1 ? "Thông tin tài khoản" : step === 2 ? "Thông tin cá nhân" : step === 3 ? "Xe & pháp lý" : step === 4 ? "Đồng sở hữu & hợp đồng" : "Xác nhận"}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressInner} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {step === 1 && (
        <section className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>Vai trò</label>
            <select className={styles.input} value={role} onChange={e => setRole(e.target.value as any)}>
              <option value="coowner">Đồng sở hữu (Co-owner)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
            <p style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>Chọn vai trò để kích hoạt luồng phù hợp (dành cho demo).</p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tên đăng nhập</label>
            <input className={styles.input} placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
            {errors.username && <span className={styles.error}>{errors.username}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Gmail</label>
            <input className={styles.input} placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Mật khẩu</label>
              <input type="password" className={styles.input} placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Xác nhận mật khẩu</label>
              <input type="password" className={styles.input} placeholder="••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>Họ tên</label>
            <input className={styles.input} placeholder="Nguyễn Văn A" value={fullName} onChange={e => setFullName(e.target.value)} />
            {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Ngày sinh</label>
            <input type="date" className={styles.input} value={dob} onChange={e => setDob(e.target.value)} />
            {errors.dob && <span className={styles.error}>{errors.dob}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Số CMND/CCCD</label>
            <input className={styles.input} placeholder="9 hoặc 12 số" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
            {errors.idNumber && <span className={styles.error}>{errors.idNumber}</span>}
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ảnh mặt trước CMND/CCCD</label>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0] ?? null;
                const msg = validateFile(f, IMAGE_TYPES, MAX_FILE_SIZE_MB);
                setErrors(prev => ({ ...prev, idFrontImage: msg || "" }));
                setIdFrontImage(msg ? null : f);
              }} />
              {errors.idFrontImage && <span className={styles.error}>{errors.idFrontImage}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ảnh mặt sau CMND/CCCD</label>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0] ?? null;
                const msg = validateFile(f, IMAGE_TYPES, MAX_FILE_SIZE_MB);
                setErrors(prev => ({ ...prev, idBackImage: msg || "" }));
                setIdBackImage(msg ? null : f);
              }} />
              {errors.idBackImage && <span className={styles.error}>{errors.idBackImage}</span>}
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className={styles.section}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Giấy phép lái xe</label>
              <input type="file" accept="image/*,application/pdf" onChange={e => {
                const f = e.target.files?.[0] ?? null;
                const msg = validateFile(f, [...IMAGE_TYPES, "application/pdf"], MAX_FILE_SIZE_MB);
                setErrors(prev => ({ ...prev, driverLicenseImage: msg || "" }));
                setDriverLicenseImage(msg ? null : f);
              }} />
              {errors.driverLicenseImage && <span className={styles.error}>{errors.driverLicenseImage}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ảnh xe</label>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0] ?? null;
                const msg = validateFile(f, IMAGE_TYPES, MAX_FILE_SIZE_MB);
                setErrors(prev => ({ ...prev, vehicleImage: msg || "" }));
                setVehicleImage(msg ? null : f);
              }} />
              {errors.vehicleImage && <span className={styles.error}>{errors.vehicleImage}</span>}
            </div>
          </div>
          <div className={styles.previewGrid} aria-live="polite">
            {driverLicensePreview && (
              <div className={styles.preview}>
                <strong>GPLX</strong>
                <img src={driverLicensePreview} alt="Xem trước giấy phép lái xe" />
              </div>
            )}
            {vehiclePreview && (
              <div className={styles.preview}>
                <strong>Ảnh xe</strong>
                <img src={vehiclePreview} alt="Xem trước ảnh xe" />
              </div>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Biển số xe</label>
            <input className={styles.input} placeholder="VD: 30A-123.45" value={licensePlate} onChange={e => {
              const v = normalizePlate(e.target.value);
              setLicensePlate(v);
              setErrors(prev => {
                const next = { ...prev };
                if (!v.trim() || plateRegex.test(v)) delete next.licensePlate;
                else next.licensePlate = "Biển số không hợp lệ (vd: 30A-123.45)";
                return next;
              });
            }} />
            {errors.licensePlate && <span className={styles.error}>{errors.licensePlate}</span>}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className={styles.section}>
          <div className={styles.ownerList}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3>Quản lý tỷ lệ sở hữu</h3>
              <span className={styles.badge} style={{ background: ownerships.reduce((s,o)=>s+(Number.isFinite(o.percent)?o.percent:0),0)===100 ? '#f1f5f9' : '#fee2e2' }}>
                Tổng: {ownerships.reduce((s, o) => s + (Number.isFinite(o.percent) ? o.percent : 0), 0)}%
              </span>
            </div>
            {ownerships.map((o, idx) => (
              <div className={styles.ownerRow} key={idx}>
                <input className={styles.input} placeholder="Tên đồng sở hữu" value={o.coOwnerName} onChange={e => updateOwnershipName(idx, e.target.value)} />
                <input className={styles.input} type="number" min={0} max={100} placeholder="%" value={Number.isFinite(o.percent) ? o.percent : 0} onChange={e => updateOwnershipPercent(idx, parseFloat(e.target.value))} />
                <button type="button" className={styles.button} onClick={() => removeOwnerRow(idx)}>Xóa</button>
                {errors[`owner_${idx}_name`] && <span className={styles.error}>{errors[`owner_${idx}_name`]}</span>}
                {errors[`owner_${idx}_percent`] && <span className={styles.error}>{errors[`owner_${idx}_percent`]}</span>}
              </div>
            ))}
            <button type="button" className={styles.button} onClick={addOwnerRow}>Thêm đồng sở hữu</button>
            <button type="button" className={`${styles.button} ${styles.outline}`} onClick={() => {
              if (ownerships.length === 0) return;
              const each = Math.floor((100 / ownerships.length) * 100) / 100;
              const rem = Math.round((100 - each * (ownerships.length - 1)) * 100) / 100;
              setOwnerships(prev => prev.map((o, i) => ({ ...o, percent: i === prev.length - 1 ? rem : each })));
              setErrors(prev => ({ ...prev, ownerships: "" }));
            }}>Chia đều 100%</button>
            {errors.ownerships && <span className={styles.error}>{errors.ownerships}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Hợp đồng đồng sở hữu (PDF/DOC/Ảnh)</label>
            <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={e => setEContractFile(e.target.files?.[0] ?? null)} />
            {eContractFile && <span className={styles.badge}>{eContractFile.name}</span>}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className={styles.section}>
          <div className={styles.reviewCard} aria-label="Tóm tắt thông tin đã nhập">
            <h3>Thông tin tài khoản <button type="button" className={`${styles.button} ${styles.outline}`} onClick={() => setStep(1 as StepKey)}>Chỉnh sửa</button></h3>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewRow}><span>Tên đăng nhập</span><strong>{username}</strong></div>
              <div className={styles.reviewRow}><span>Email</span><strong>{email}</strong></div>
            </div>

            <h3 style={{ marginTop: 12 }}>Thông tin cá nhân <button type="button" className={`${styles.button} ${styles.outline}`} onClick={() => setStep(2 as StepKey)}>Chỉnh sửa</button></h3>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewRow}><span>Họ tên</span><strong>{fullName}</strong></div>
              <div className={styles.reviewRow}><span>Ngày sinh</span><strong>{dob}</strong></div>
              <div className={styles.reviewRow}><span>CMND/CCCD</span><strong>{idNumber}</strong></div>
            </div>

            <h3 style={{ marginTop: 12 }}>Xe & pháp lý <button type="button" className={`${styles.button} ${styles.outline}`} onClick={() => setStep(3 as StepKey)}>Chỉnh sửa</button></h3>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewRow}><span>Biển số</span><strong>{licensePlate}</strong></div>
              <div className={styles.reviewRow}><span>GPLX</span><strong>{driverLicenseImage ? driverLicenseImage.name : "(chưa tải)"}</strong></div>
              <div className={styles.reviewRow}><span>Ảnh xe</span><strong>{vehicleImage ? vehicleImage.name : "(chưa tải)"}</strong></div>
            </div>

            <h3 style={{ marginTop: 12 }}>Đồng sở hữu</h3>
            {ownerships.length > 0 && (
              <div className={styles.ownerList}>
                {ownerships.map((o, idx) => (
                  <div className={styles.reviewRow} key={idx}>
                    <span>{o.coOwnerName || "(chưa đặt tên)"}</span>
                    <strong>{Number.isFinite(o.percent) ? o.percent : 0}%</strong>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.reviewRow} style={{ marginTop: 8 }}>
              <span>Hợp đồng</span>
              <strong>{eContractFile ? eContractFile.name : "(không có)"}</strong>
            </div>
          </div>
        </section>
      )}

      <div className={styles.actions}>
        <button type="button" className={`${styles.button} ${styles.outline}`} onClick={goBack} disabled={step === 1}>Quay về</button>
        <button type="button" className={styles.button} onClick={() => {
          setUsername(""); setEmail(""); setRole("coowner");
          setPassword(""); setConfirmPassword("");
          setFullName(""); setDob(""); setIdNumber("");
          setIdFrontImage(null); setIdBackImage(null);
          setDriverLicenseImage(null); setVehicleImage(null);
          setDriverLicensePreview(null); setVehiclePreview(null);
          setLicensePlate(""); setOwnerships([{ coOwnerName: "", percent: 0 }]);
          setEContractFile(null); setErrors({});
          setStep(1 as StepKey);
          try { localStorage.removeItem("registrationForm"); } catch {}
        }}>Làm lại</button>
        {step < 5 && (
          <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={goNext}
            aria-disabled={!isStepValid}
            disabled={!isStepValid}
            aria-label="Tiếp tục sang bước tiếp theo"
          >
            Tiếp tục
          </button>
        )}
        {step === 5 && (
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={handleSubmit}>Đăng ký</button>
        )}
      </div>
        {/** Illustration on large screens */}
        <aside className={styles.illustration} aria-hidden>
          <div className={styles.illustrationInner}>
            <img src="/ev-logo-custom.svg" alt="" style={{ width: '100%', height: 160, objectFit: 'contain' }} />
            <p style={{ color: '#0f172a', marginTop: 12 }}>EV Co-ownership • An toàn • Minh bạch</p>
          </div>
        </aside>
      </div>
    </div>
  );
}


