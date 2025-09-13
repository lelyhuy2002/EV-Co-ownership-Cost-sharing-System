import styles from "./HowItWorks.module.css";
import { STEPS } from "@/constants";

export default function HowItWorks() {
  return (
    <section id="marketplace" className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Cách thức hoạt động</h2>
      <div className={styles.steps}>
        {STEPS.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.stepNum}>{step.number}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
