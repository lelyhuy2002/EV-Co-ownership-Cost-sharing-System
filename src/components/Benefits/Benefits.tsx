import styles from "./Benefits.module.css";
import "./BenefitsEffects.css";
import { BENEFITS } from "@/constants";

const cardColors = [
  { 
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderColor: 'rgba(59, 130, 246, 0.2)'
  },
  { 
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    borderColor: 'rgba(245, 158, 11, 0.2)'
  },
  { 
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)',
    iconBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    borderColor: 'rgba(139, 92, 246, 0.2)'
  },
  { 
    gradient: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
    iconBg: 'linear-gradient(135deg, #f97316, #ea580c)',
    borderColor: 'rgba(249, 115, 22, 0.2)'
  },
  { 
    gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    iconBg: 'linear-gradient(135deg, #ec4899, #db2777)',
    borderColor: 'rgba(236, 72, 153, 0.2)'
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Vì sao chọn chúng tôi</h2>
      <div className={styles.cards}>
        {BENEFITS.map((benefit, index) => {
          const colorScheme = cardColors[index % cardColors.length];
          return (
            <div 
              key={index} 
              className={styles.card}
              style={{
                background: colorScheme.gradient,
                borderColor: colorScheme.borderColor
              }}
            >
              <div className={styles.cardIcon}>
                <span 
                  className={styles.iconBadge}
                  style={{ background: colorScheme.iconBg }}
                >
                  {benefit.icon}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardText}>{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
