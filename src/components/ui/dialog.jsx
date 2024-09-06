import React from 'react';

export function Dialog({ children }) {
  return <div className="dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">{children}</div>; // Added bg-black bg-opacity-50 for overlay
}

export function DialogContent({ children }) {
  return <div className="dialog-content bg-white p-4 rounded shadow-lg">{children}</div>; // Set background to white
}

export function DialogHeader({ children }) {
  return <header className="dialog-header">{children}</header>;
}

export function DialogTitle({ children }) {
  return <h2 className="dialog-title">{children}</h2>;
}

export function DialogFooter({ children }) {
  return <footer className="dialog-footer">{children}</footer>;
}
