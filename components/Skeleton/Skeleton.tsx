import styles from "./Skeleton.module.css"

export default function Skeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.block} ${styles.avatar}`} />
        <div className={styles.headerLines}>
          <div className={`${styles.block} ${styles.lineLong}`} />
          <div className={`${styles.block} ${styles.lineMedium}`} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={`${styles.block} ${styles.lineFull}`} />
        <div className={`${styles.block} ${styles.lineFull}`} />
        <div className={`${styles.block} ${styles.lineShort}`} />
      </div>
    </div>
  )
}
