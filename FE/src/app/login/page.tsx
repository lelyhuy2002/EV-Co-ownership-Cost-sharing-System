"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1); // 1, 2, or 3
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  
  // Sign Up Step 1 state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  
  // Sign Up Step 2 state
  const [signUpCccd, setSignUpCccd] = useState("");
  const [signUpDriverLicense, setSignUpDriverLicense] = useState("");
  const [signUpBirthday, setSignUpBirthday] = useState("");
  const [signUpLocation, setSignUpLocation] = useState("");
  const [cccdFrontFile, setCccdFrontFile] = useState<File | null>(null);
  const [cccdBackFile, setCccdBackFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  
  // Common Sign Up state
  const [signUpAgreeTerms, setSignUpAgreeTerms] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  
  // Image preview states
  const [cccdFrontPreview, setCccdFrontPreview] = useState<string | null>(null);
  const [cccdBackPreview, setCccdBackPreview] = useState<string | null>(null);
  const [driverLicensePreview, setDriverLicensePreview] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignInLoading) return;
    
    setSignInError("");
    setIsSignInLoading(true);
    
    try {
      const result = await login({ email: signInEmail, password: signInPassword });
      
      console.log('Login result:', result); // Debug log
      
      if (!result.success) {
        // Ensure error message is a string
        const errorMsg = typeof result.message === 'string' 
          ? result.message 
          : JSON.stringify(result.message);
        setSignInError(errorMsg);
      }
      // If success, AuthContext will handle redirect automatically
    } catch (error) {
      console.error('Login exception:', error); // Debug log
      const errorMsg = error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
      setSignInError(errorMsg);
    } finally {
      setIsSignInLoading(false);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  // Handle file upload with preview
  const handleCccdFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCccdFrontFile(file);
      const reader = new FileReader();
      reader.onload = () => setCccdFrontPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCccdBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCccdBackFile(file);
      const reader = new FileReader();
      reader.onload = () => setCccdBackPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDriverLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDriverLicenseFile(file);
      const reader = new FileReader();
      reader.onload = () => setDriverLicensePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpStep1 = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignUpError("");
    
    // Step 1 validation
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    if (signUpPassword.length < 6) {
      setSignUpError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    
    // Move to step 2
    setSignUpStep(2);
  };

  const handleSignUpStep2 = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignUpError("");
    
    // Step 2 validation
    if (!signUpCccd || !signUpDriverLicense || !signUpBirthday || !signUpLocation) {
      setSignUpError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    
    // CCCD number validation (must be 9 or 12 digits)
    const cccdNumber = signUpCccd.replace(/\D/g, ''); // Remove non-digits
    if (cccdNumber.length !== 9 && cccdNumber.length !== 12) {
      setSignUpError("CCCD phải là 9 số (CMND cũ) hoặc 12 số (CCCD mới)!");
      return;
    }
    
    // Age validation (must be over 18)
    const birthDate = new Date(signUpBirthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    // Check if birthday has passed this year
    const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
    
    if (actualAge < 18) {
      setSignUpError("Bạn phải trên 18 tuổi để đăng ký!");
      return;
    }
    
    if (!cccdFrontFile || !cccdBackFile || !driverLicenseFile) {
      setSignUpError("Vui lòng upload đầy đủ các ảnh giấy tờ!");
      return;
    }
    
    if (!signUpAgreeTerms) {
      setSignUpError("Vui lòng đồng ý với điều khoản sử dụng!");
      return;
    }
    
    // Move to step 3 for review
    setSignUpStep(3);
  };

  const handleSignUpStep3 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignUpLoading) return;
    
    setSignUpError("");
    setIsSignUpLoading(true);
    
    try {
      // Convert files to base64
      const cccdFrontBase64 = await fileToBase64(cccdFrontFile!);
      const cccdBackBase64 = await fileToBase64(cccdBackFile!);
      const driverLicenseBase64 = await fileToBase64(driverLicenseFile!);
      
      // Prepare registration data
      const registerData = {
        fullName: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        cccd: signUpCccd,
        driverLicense: signUpDriverLicense,
        birthday: signUpBirthday,
        location: signUpLocation,
        cccdFrontBase64,
        cccdBackBase64,
        driverLicenseBase64
      };
      
      // Call API to register via ApiService (uses configured base URL)
      const result = await apiService.register(registerData);

      if (result.success) {
        // Registration successful - show success overlay
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
          setIsSignUpMode(false);
          setSignUpStep(1);
          // Auto-fill email in login form
          setSignInEmail(signUpEmail);
          resetSignUpForm();
        }, 1500);
      } else {
        setSignUpError(result.message || "Đăng ký thất bại!");
      }
      
    } catch (error) {
      setSignUpError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSignUpLoading(false);
    }
  };
  
  const resetSignUpForm = () => {
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpConfirmPassword("");
    setSignUpCccd("");
    setSignUpDriverLicense("");
    setSignUpBirthday("");
    setSignUpLocation("");
    setCccdFrontFile(null);
    setCccdBackFile(null);
    setDriverLicenseFile(null);
    setCccdFrontPreview(null);
    setCccdBackPreview(null);
    setDriverLicensePreview(null);
    setSignUpAgreeTerms(false);
    setSignUpError("");
  };
  
  const goBackToStep1 = () => {
    setSignUpStep(1);
    setSignUpError("");
  };
  
  const goBackToStep2 = () => {
    setSignUpStep(2);
    setSignUpError("");
  };

  console.log('isSignUpMode:', isSignUpMode); // Debug log
  
  return (
    <div className={styles.mainContainer}>
      <div className={`${styles.container} ${isSignUpMode ? styles.signUpMode : ''}`} style={{
        transition: 'all 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}>
        {/* Sign Up Form */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`} style={{
          transition: 'all 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}>
          {signUpStep === 1 ? (
            <form onSubmit={handleSignUpStep1} className={styles.form}>
              <h1 className={styles.formTitle}>Create Account</h1>
              
              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressStep} ${styles.activeStep}`}>1</div>
                  <div className={styles.progressLine}></div>
                  <div className={styles.progressStep}>2</div>
                  <div className={styles.progressLine}></div>
                  <div className={styles.progressStep}>3</div>
                </div>
                <div className={styles.progressLabels}>
                  <span className={styles.activeLabel}>Basic Info</span>
                  <span>Verification</span>
                  <span>Review</span>
                </div>
              </div>
              
              {signUpError && (
                <div className={signUpError.includes('thành công') || signUpError.includes('success') ? styles.successMessage : styles.errorMessage}>
                  {signUpError}
                </div>
              )}
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className={styles.inputField}
                  required
                  minLength={6}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  className={styles.inputField}
                  required
                  minLength={6}
                />
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Next Step
              </button>
            </form>
          ) : signUpStep === 2 ? (
            <form onSubmit={handleSignUpStep2} className={styles.form}>
              <h1 className={styles.formTitle}>Create Account</h1>
              
              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressStep} ${styles.completedStep}`}>1</div>
                  <div className={`${styles.progressLine} ${styles.completedLine}`}></div>
                  <div className={`${styles.progressStep} ${styles.activeStep}`}>2</div>
                  <div className={styles.progressLine}></div>
                  <div className={styles.progressStep}>3</div>
                </div>
                <div className={styles.progressLabels}>
                  <span className={styles.completedLabel}>Basic Info</span>
                  <span className={styles.activeLabel}>Verification</span>
                  <span>Review</span>
                </div>
              </div>
              
              {signUpError && (
                <div className={signUpError.includes('thành công') || signUpError.includes('success') ? styles.successMessage : styles.errorMessage}>
                  {signUpError}
                </div>
              )}
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0r0 2V8z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  placeholder="CCCD Number"
                  value={signUpCccd}
                  onChange={(e) => setSignUpCccd(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  placeholder="Driver License Number"
                  value={signUpDriverLicense}
                  onChange={(e) => setSignUpDriverLicense(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="date"
                  placeholder="Birthday"
                  value={signUpBirthday}
                  onChange={(e) => setSignUpBirthday(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  placeholder="Location/Address"
                  value={signUpLocation}
                  onChange={(e) => setSignUpLocation(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.fileUploadGroup}>
                <label className={styles.fileLabel}>CCCD Front Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCccdFrontUpload}
                  className={styles.fileInput}
                  required
                />
                {cccdFrontFile && <span className={styles.fileName}>{cccdFrontFile.name}</span>}
                {cccdFrontPreview && (
                  <div className={styles.imagePreview}>
                    <img src={cccdFrontPreview} alt="CCCD Front Preview" className={styles.previewImage} />
                  </div>
                )}
              </div>
              
              <div className={styles.fileUploadGroup}>
                <label className={styles.fileLabel}>CCCD Back Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCccdBackUpload}
                  className={styles.fileInput}
                  required
                />
                {cccdBackFile && <span className={styles.fileName}>{cccdBackFile.name}</span>}
                {cccdBackPreview && (
                  <div className={styles.imagePreview}>
                    <img src={cccdBackPreview} alt="CCCD Back Preview" className={styles.previewImage} />
                  </div>
                )}
              </div>
              
              <div className={styles.fileUploadGroup}>
                <label className={styles.fileLabel}>Driver License Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDriverLicenseUpload}
                  className={styles.fileInput}
                  required
                />
                {driverLicenseFile && <span className={styles.fileName}>{driverLicenseFile.name}</span>}
                {driverLicensePreview && (
                  <div className={styles.imagePreview}>
                    <img src={driverLicensePreview} alt="Driver License Preview" className={styles.previewImage} />
                  </div>
                )}
              </div>
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={signUpAgreeTerms}
                    onChange={(e) => setSignUpAgreeTerms(e.target.checked)}
                    className={styles.checkbox}
                    required
                  />
                  <span className={styles.checkboxText}>
                    I agree to the <a href="#" className={styles.termsLink}>Terms & Conditions</a>
                  </span>
                </label>
              </div>
              
              <div className={styles.buttonGroup}>
                <button type="button" onClick={goBackToStep1} className={styles.backButton}>
                  Back
                </button>
                <button type="submit" className={styles.submitButton}>
                  Review Information
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUpStep3} className={styles.form}>
              <h1 className={styles.formTitle}>Review Information</h1>
              
              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressStep} ${styles.completedStep}`}>1</div>
                  <div className={`${styles.progressLine} ${styles.completedLine}`}></div>
                  <div className={`${styles.progressStep} ${styles.completedStep}`}>2</div>
                  <div className={`${styles.progressLine} ${styles.completedLine}`}></div>
                  <div className={`${styles.progressStep} ${styles.activeStep}`}>3</div>
                </div>
                <div className={styles.progressLabels}>
                  <span className={styles.completedLabel}>Basic Info</span>
                  <span className={styles.completedLabel}>Verification</span>
                  <span className={styles.activeLabel}>Review</span>
                </div>
              </div>
              
              {signUpError && (
                <div className={signUpError.includes('thành công') || signUpError.includes('success') ? styles.successMessage : styles.errorMessage}>
                  {signUpError}
                </div>
              )}
              
              {/* Review Section */}
              <div className={styles.reviewContainer}>
                <h3 className={styles.reviewSectionTitle}>Personal Information</h3>
                <div className={styles.reviewItem}>
                  <strong>Full Name:</strong> <span>{signUpName}</span>
                </div>
                <div className={styles.reviewItem}>
                  <strong>Email:</strong> <span>{signUpEmail}</span>
                </div>
                <div className={styles.reviewItem}>
                  <strong>Password:</strong> <span>{'•'.repeat(signUpPassword.length)}</span>
                </div>
                
                <h3 className={styles.reviewSectionTitle}>Verification Details</h3>
                <div className={styles.reviewItem}>
                  <strong>CCCD Number:</strong> <span>{signUpCccd}</span>
                </div>
                <div className={styles.reviewItem}>
                  <strong>Driver License:</strong> <span>{signUpDriverLicense}</span>
                </div>
                <div className={styles.reviewItem}>
                  <strong>Birthday:</strong> <span>{new Date(signUpBirthday).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.reviewItem}>
                  <strong>Location:</strong> <span>{signUpLocation}</span>
                </div>
                
                <h3 className={styles.reviewSectionTitle}>Uploaded Documents</h3>
                <div className={styles.reviewImagesGrid}>
                  {cccdFrontPreview && (
                    <div className={styles.reviewImageItem}>
                      <label>CCCD Front:</label>
                      <img src={cccdFrontPreview} alt="CCCD Front" className={styles.reviewImage} />
                    </div>
                  )}
                  {cccdBackPreview && (
                    <div className={styles.reviewImageItem}>
                      <label>CCCD Back:</label>
                      <img src={cccdBackPreview} alt="CCCD Back" className={styles.reviewImage} />
                    </div>
                  )}
                  {driverLicensePreview && (
                    <div className={styles.reviewImageItem}>
                      <label>Driver License:</label>
                      <img src={driverLicensePreview} alt="Driver License" className={styles.reviewImage} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.buttonGroup}>
                <button type="button" onClick={goBackToStep2} className={styles.backButton}>
                  Back to Edit
                </button>
                <button type="submit" className={styles.submitButton} disabled={isSignUpLoading}>
                  {isSignUpLoading ? "Registering..." : "Confirm Registration"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sign In Form */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`} style={{
          transition: 'all 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}>
          <form onSubmit={handleSignIn} className={styles.form}>
            <h1 className={styles.formTitle}>Sign in to EV System</h1>
            
            
            {signInError && (
              <div className={styles.errorMessage}>
                {signInError}
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            
            <a href="#" className={styles.forgotLink}>Forgot your password?</a>
            
            <button type="submit" className={styles.submitButton} disabled={isSignInLoading}>
              {isSignInLoading ? "Loading..." : "SIGN IN"}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className={styles.overlayContainer} style={{
          transition: 'transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}>
          <div className={styles.overlay} style={{
            transition: 'transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}>
            {/* Floating Particles */}
            <div className={styles.particleContainer}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}></div>
              ))}
            </div>
            
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.overlayTitle}>Welcome Back!</h1>
              <p className={styles.overlayText}>
                To keep connected with us please login with your personal info
              </p>
              <button 
                className={styles.ghostButton}
                onClick={() => {
                  setIsSignUpMode(false);
                  setSignUpStep(1);
                  setSignUpError("");
                }}
              >
                SIGN IN
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.overlayTitle}>Hello, Friend!</h1>
              <p className={styles.overlayText}>
                Enter your personal details and start journey with us
              </p>
              <button 
                className={styles.ghostButton}
                onClick={() => {
                  setIsSignUpMode(true);
                  setSignUpStep(1);
                  setSignUpError("");
                }}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className={styles.successOverlay}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#52B788" strokeWidth="2" fill="white" className={styles.successCircle}/>
                <path d="m9 12 2 2 4-4" stroke="#52B788" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.successCheckmark}/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


