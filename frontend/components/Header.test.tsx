import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders stats values', () => {
    render(
      <Header
        onMenuClick={() => {}}
        stats={{
          latency: 12,
          status: 'OPTIMIZED',
          uptime: '00:10:00',
          nodeLoad: 54,
          nodeName: 'LOCAL_NODE'
        }}
      />
    );

    expect(screen.getByText('TTY.FM')).toBeInTheDocument();
    expect(screen.getByText('12ms')).toBeInTheDocument();
    expect(screen.getByText('OPTIMIZED')).toBeInTheDocument();
    expect(screen.getByText('00:10:00')).toBeInTheDocument();
    expect(screen.getByText('54%')).toBeInTheDocument();
    expect(screen.getByText('NODE: LOCAL_NODE')).toBeInTheDocument();
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const onMenuClick = jest.fn();

    render(
      <Header
        onMenuClick={onMenuClick}
        stats={{
          latency: 12,
          status: 'OPTIMIZED',
          uptime: '00:10:00',
          nodeLoad: 54,
          nodeName: 'LOCAL_NODE'
        }}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});