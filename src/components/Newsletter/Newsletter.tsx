import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input[type="email"]') as HTMLInputElement;
    alert(`Cảm ơn! Chúng tôi sẽ gửi cập nhật đến ${input.value}`);
    input.value = "";
  };

  return (
    <section className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Đăng ký nhận tin</h2>
      <form className={styles.newsletter} onSubmit={handleSubmit}>
        <input type="email" required placeholder="Nhập email của bạn" aria-label="Email" />
        <button type="submit" className={`${styles.button} ${styles.primary}`}>Đăng ký</button>
      </form>
    </section>
  );
}
