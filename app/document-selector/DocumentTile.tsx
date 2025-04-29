import Link from "next/link";
import styles from "./DocumentTile.module.css";

interface DocumentTileProps {
  id: string;
  title: string;
  createdAt: string;
}

export default function DocumentTile({
  id,
  title,
  createdAt,
}: DocumentTileProps) {
  return (
    <Link href={`/editor?docId=${id}`} className={styles.tile}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.date}>{new Date(createdAt).toLocaleString()}</p>
    </Link>
  );
}
