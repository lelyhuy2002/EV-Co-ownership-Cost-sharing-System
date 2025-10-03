"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Registration.module.css";

type OwnershipEntry = {
  coOwnerName: string;
  percent: number;
};

type StepKey = 1 | 2 | 3;

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>(1);

  // Step 1: Account
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"co_owner" | "admin">("co_owner");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Personal
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [idFrontImage, setIdFrontImage] = useState<File | null>(null);
  const [idBackImage, setIdBackImage] = useState<File | null>(null);

// GPLX upload (moved into step 2)
  const [driverLicenseImage, setDriverLicenseImage] = useState<File | null>(null);
  const [driverLicensePreview, setDriverLicensePreview] = useState<string | null>(null);

  // Step 4 removed: ownership & e-contract

  // Errors (simple real-time validation)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progressPercent = useMemo(() => {
    return Math.round(((step - 1) / 2) * 100);
  }, [step]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const idRegex = /^(\d{9}|\d{12})$/;

  // Age constraints
  const MIN_AGE_YEARS = 18;
  function calculateAgeYears(dateStr: string): number {
    if (!dateStr) return 0;
    const dobDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  }
  function dateYearsAgo(years: number): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

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

  // removed plate handling (no step for vehicle)

  // Step validity (for disabling Next button)
  const isStepValid = useMemo(() => {
    if (step === 1) {
      // Username is optional for DB; only require email and password
      return (
        emailRegex.test(email) &&
        password.length >= 6 &&
        confirmPassword === password
      );
    }
    if (step === 2) {
      // Only require full name and birthday and ensure age >= 18. CCCD and driver_license are optional.
      return fullName.trim().length > 0 && !!dob && calculateAgeYears(dob) >= MIN_AGE_YEARS;
    }
    if (step === 3) {
      return true;
    }
    return true;
  }, [step, username, email, password, confirmPassword, fullName, dob, idNumber, idFrontImage, idBackImage, driverLicenseImage]);

  // Image previews for step 3
  useEffect(() => {
    if (driverLicenseImage) {
      const url = URL.createObjectURL(driverLicenseImage);
      setDriverLicensePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setDriverLicensePreview(null);
  }, [driverLicenseImage]);

  // removed vehicle preview effect

  // Autosave to localStorage (except File objects)
  useEffect(() => {
    const saved = localStorage.getItem("registrationForm");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.step) setStep(Math.min(3, data.step) as StepKey);
        setUsername(data.username ?? "");
        setEmail(data.email ?? "");
        setRole("co_owner");
        setPassword(data.password ?? "");
        setConfirmPassword(data.confirmPassword ?? "");
        setFullName(data.fullName ?? "");
        setDob(data.dob ?? "");
        setIdNumber(data.idNumber ?? "");
        setDriverLicense(data.driverLicense ?? "");
        setLicensePlate(data.licensePlate ?? "");
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
      role: "co_owner",
      password,
      confirmPassword,
      fullName,
      dob,
      idNumber,
      driverLicense,
      
    };
    localStorage.setItem("registrationForm", JSON.stringify(toSave));
  }, [step, username, email, password, confirmPassword, fullName, dob, idNumber, driverLicense]);

  function validateCurrentStep(): boolean {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!emailRegex.test(email)) nextErrors.email = "Email không hợp lệ";
      if (password.length < 6) nextErrors.password = "Mật khẩu tối thiểu 6 ký tự";
      if (confirmPassword !== password) nextErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (step === 2) {
      if (!fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ tên";
      if (!dob) nextErrors.dob = "Vui lòng nhập ngày sinh";
      else if (calculateAgeYears(dob) < MIN_AGE_YEARS) nextErrors.dob = `Bạn phải từ ${MIN_AGE_YEARS} tuổi trở lên`;
      // CCCD (idNumber) and driver_license are optional per DB, but if provided, validate CCCD format
      if (idNumber && !idRegex.test(idNumber)) nextErrors.idNumber = "CMND/CCCD phải 9 hoặc 12 số";
    }

    // No step 3 validation needed (review)

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setStep(prev => {
      const nextStep = Math.min(3, prev + 1);
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
      // Align with Users DB table
      user: {
        full_name: fullName,
        email,
        password_hash: password, // NOTE: hash on server side
        cccd: idNumber || null,
        driver_license: driverLicense || null,
        birthday: dob || null,
        role: "co_owner",
        verification_status: 'unverified',
      },
    };
    // TODO: send payload and files to API endpoint
    // For now, save to localStorage as current user (mock backend-less flow)
    const current = {
      id: `user-${Math.random().toString(36).slice(2, 9)}`,
      username,
      email,
      fullName,
      role: "co_owner",
      groups: [],
      hasGroups: false
    };
    try {
      localStorage.setItem('currentUser', JSON.stringify(current));
    } catch {
      // ignore
    }
    // Redirect to login page after successful registration
    router.push('/login');
  }

  // Keyboard shortcuts: Enter -> next/submit, Escape -> back
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step < 3) {
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

  // Ownership handlers removed

  return (
    <div className={styles.container}>
      <div className={styles.formCard} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
      <div className={styles.header}>
        <h1>Đăng ký</h1>
        <span className={styles.badge}>Bước {step}/3 — {step === 1 ? "Thông tin tài khoản" : step === 2 ? "Thông tin cá nhân" : "Xác nhận"}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressInner} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {step === 1 && (
        <section className={styles.section} aria-label="Xác nhận thông tin">
          {/** Vai trò mặc định là 'co_owner' và không hiển thị trên UI */}
          {/* Username is not in Users DB schema, keep optional or remove from validation */}
          <div className={styles.field}>
            <label className={styles.label}>Tên đăng nhập (tùy chọn)</label>
            <input className={styles.input} placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Mật khẩu (sẽ được băm ở backend)</label>
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
            <input
              type="date"
              className={styles.input}
              value={dob}
              onChange={e => {
                const v = e.target.value;
                setDob(v);
                setErrors(prev => {
                  const next = { ...prev };
                  if (!v) next.dob = "Vui lòng nhập ngày sinh";
                  else if (calculateAgeYears(v) < MIN_AGE_YEARS) next.dob = `Bạn phải từ ${MIN_AGE_YEARS} tuổi trở lên`;
                  else delete next.dob;
                  return next;
                });
              }}
            />
            {errors.dob && <span className={styles.error}>{errors.dob}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Số CMND/CCCD (tùy chọn)</label>
            <input className={styles.input} placeholder="9 hoặc 12 số" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
            {errors.idNumber && <span className={styles.error}>{errors.idNumber}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Số giấy phép lái xe (tùy chọn)</label>
            <input className={styles.input} placeholder="VD: 79-123456789" value={driverLicense} onChange={e => setDriverLicense(e.target.value)} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ảnh mặt trước CMND/CCCD (tùy chọn)</label>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0] ?? null;
                const msg = validateFile(f, IMAGE_TYPES, MAX_FILE_SIZE_MB);
                setErrors(prev => ({ ...prev, idFrontImage: msg || "" }));
                setIdFrontImage(msg ? null : f);
              }} />
              {errors.idFrontImage && <span className={styles.error}>{errors.idFrontImage}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ảnh mặt sau CMND/CCCD (tùy chọn)</label>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0] ?? null;
                const msg = validateFile(f, IMAGE_TYPES, MAX_FILE_SIZE_MB);
                setErrors(prev => ({ ...prev, idBackImage: msg || "" }));
                setIdBackImage(msg ? null : f);
              }} />
              {errors.idBackImage && <span className={styles.error}>{errors.idBackImage}</span>}
            </div>
          </div>
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
          {driverLicensePreview && (
            <div className={styles.preview}>
              <strong>GPLX</strong>
              <img src={driverLicensePreview} alt="Xem trước giấy phép lái xe" />
            </div>
          )}
        </section>
      )}

      

      {/* Ownership step removed */}

      {step === 3 && (
        <section className={styles.section}>
          <div className={styles.reviewCard} aria-label="Tóm tắt thông tin đã nhập">
            <div className={styles.reviewSection}>
              <div className={styles.reviewSectionHeader}>
                <h3 className={styles.reviewSectionTitle}>Thông tin tài khoản</h3>
                <button type="button" className={styles.editButton} onClick={() => setStep(1 as StepKey)}>
                  <span className={styles.editIcon}>✎</span>
                  Chỉnh sửa
                </button>
              </div>
              <div className={styles.reviewGrid}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Tên đăng nhập</span>
                  <span className={styles.reviewValue}>{username || '(không cung cấp)'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Email</span>
                  <span className={styles.reviewValue}>{email}</span>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewSectionHeader}>
                <h3 className={styles.reviewSectionTitle}>Thông tin cá nhân</h3>
                <button type="button" className={styles.editButton} onClick={() => setStep(2 as StepKey)}>
                  <span className={styles.editIcon}>✎</span>
                  Chỉnh sửa
                </button>
              </div>
              <div className={styles.reviewGrid}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Họ tên</span>
                  <span className={styles.reviewValue}>{fullName}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Ngày sinh</span>
                  <span className={styles.reviewValue}>{dob}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>CMND/CCCD</span>
                  <span className={styles.reviewValue}>{idNumber || '(không cung cấp)'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Số GPLX</span>
                  <span className={styles.reviewValue}>{driverLicense || '(không cung cấp)'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Giấy phép lái xe</span>
                  <span className={styles.reviewValue}>{driverLicenseImage ? driverLicenseImage.name : "(chưa tải)"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className={styles.actions}>
        <button type="button" className={`${styles.button} ${styles.outline}`} onClick={goBack} disabled={step === 1}>Quay về</button>
        <button type="button" className={styles.button} onClick={() => {
          setUsername(""); setEmail(""); setRole("co_owner");
          setPassword(""); setConfirmPassword("");
          setFullName(""); setDob(""); setIdNumber("");
          setIdFrontImage(null); setIdBackImage(null);
          setDriverLicenseImage(null); setVehicleImage(null);
          setDriverLicensePreview(null); setVehiclePreview(null);
          setLicensePlate("");
          setErrors({});
          setStep(1 as StepKey);
          try { localStorage.removeItem("registrationForm"); } catch {}
        }}>Làm lại</button>
        {step < 3 && (
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
        {step === 3 && (
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


