import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DatePicker from '../DatePicker';

describe('Integration Test', () => {
  test('adds a task and displays it in TaskViewer', async () => {
    render(<DatePicker />);

    // Open the task dialog
    fireEvent.click(screen.getByText('1')); // Click on the first day of the month
    fireEvent.change(screen.getByPlaceholderText('Enter your task'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('End Date:'), { target: { value: '2024-10-10' } }); // Ensure the date is correct
    fireEvent.click(screen.getByText('Add Task'));

    // Wait for the task to be displayed in TaskViewer
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });
});