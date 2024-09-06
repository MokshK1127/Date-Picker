import React from 'react';

export function Alert({ children }) {
  return <div className="alert">{children}</div>;
}

export function AlertDescription({ children }) {
  return <div className="alert-description">{children}</div>;
}

export function AlertTitle({ children }) {
  return <h3 className="alert-title">{children}</h3>;
}
