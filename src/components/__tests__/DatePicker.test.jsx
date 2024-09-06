import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom
import DatePicker from '../DatePicker';

describe('DatePicker', () => {
  test('renders the calendar and task viewer', () => {
    render(<DatePicker />);
    expect(screen.getByText(/Reminders for today/i)).toBeInTheDocument();
  });

  test('opens task dialog on date click', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByText('1')); // Assuming the first day of the month is rendered
    expect(screen.getByPlaceholderText('Enter your task')).toBeInTheDocument();
  });
});