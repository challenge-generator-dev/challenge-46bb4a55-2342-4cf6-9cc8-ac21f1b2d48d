import type { Order } from '../types/order.types';
import { formatDate } from '@/shared/utils/date';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const STATUS_CLASSES: Record<string, string> = {
  pending: styles.statusPending,
  processing: styles.statusProcessing,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

export function OrderCard({ order, onEdit, onDelete, isDeleting }: OrderCardProps) {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Está seguro de eliminar esta orden?')) {
      onDelete(order.id);
    }
  };

  return (
    <article className={styles.card} aria-label={`Orden ${order.id}`}>
      <header className={styles.header}>
        <div className={styles.idSection}>
          <span className={styles.label}>Orden</span>
          <span className={styles.orderId}>#{order.id.slice(0, 8)}</span>
        </div>
        <span className={`${styles.status} ${STATUS_CLASSES[order.status]}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </header>

      <section className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cliente</h3>
          <p className={styles.clientName}>{order.customerName}</p>
          <p className={styles.clientEmail}>{order.customerEmail}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Productos</h3>
          <ul className={styles.itemsList} role="list">
            {order.items.map((item, index) => (
              <li key={index} className={styles.item}>
                <span className={styles.itemName}>{item.productName}</span>
                <span className={styles.itemQuantity}>x{item.quantity}</span>
                <span className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Resumen</h3>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Impuestos</span>
              <span>${(totalAmount * 0.16).toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${(totalAmount * 1.16).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Fecha</h3>
          <time className={styles.date} dateTime={order.createdAt}>
            {formatDate(order.createdAt)}
          </time>
        </div>
      </section>

      <footer className={styles.footer}>
        <button
          className={styles.editButton}
          onClick={() => onEdit?.(order)}
          disabled={isDeleting}
          aria-label={`Editar orden ${order.id}`}
        >
          Editar
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Eliminar orden ${order.id}`}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </footer>
    </article>
  );
}