import React from 'react';
import { PRODUCT_STATUS, PRODUCT_MODALITY, ORDER_STATUS } from '../../core/constants';

export const StatusBadge = ({ status, type = 'product', size = 'normal' }) => {
  if (!status) return null;

  let config = { label: status, color: 'neutral' };

  if (type === 'product') {
    const key = Object.keys(PRODUCT_STATUS).find(
      k => PRODUCT_STATUS[k].id === status
    );
    if (key) config = PRODUCT_STATUS[key];
  } else if (type === 'modality') {
    const key = Object.keys(PRODUCT_MODALITY).find(
      k => PRODUCT_MODALITY[k].id === status
    );
    if (key) {
      return (
        <span className="badge badge-soft" style={{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }}>
          {PRODUCT_MODALITY[key].badge}
        </span>
      );
    }
  } else if (type === 'order') {
    const key = Object.keys(ORDER_STATUS).find(
      k => ORDER_STATUS[k].id === status
    );
    if (key) config = ORDER_STATUS[key];
  }

  const badgeClass = `badge badge-${config.color || 'neutral'}`;

  return (
    <span
      className={badgeClass}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem'
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block'
        }}
      />
      {config.label}
    </span>
  );
};
