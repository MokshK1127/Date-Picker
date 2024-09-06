import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskViewer from '../TaskViewer';

describe('TaskViewer', () => {
  const mockTasks = [
    { date: '2024-10-01', task: 'Task 1', recurrence: 'daily' },
    { date: '2024-10-02', task: 'Task 2', recurrence: 'weekly' },
  ];

  test('renders task list correctly', async () => {
    render(<TaskViewer tasks={mockTasks} selectedDate={new Date('2024-10-01')} />);
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
