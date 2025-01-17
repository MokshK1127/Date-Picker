import React from 'react';

export function Input({ type = 'text', value, onChange }) {
  return <input type={type} value={value} onChange={onChange} className="input" />;
}
