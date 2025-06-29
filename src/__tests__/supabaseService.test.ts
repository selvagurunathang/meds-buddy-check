import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../lib/supabaseService';
import { supabase } from '../lib/supabaseClient';

vi.mock('../lib/supabaseClient', () => {
  const insertMock = vi.fn().mockReturnValue({ error: null });
  const fromMock = vi.fn(() => ({ insert: insertMock }));

  return {
    supabase: {
      from: fromMock,
    },
  };
});

describe('Supabase Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a medication successfully', async () => {
    const medication = {
      name: 'Paracetamol',
      dosage: '500',
      schedule: 'daily',
      userId: 'test-user',
    };

    await service.addMedication(medication);

    expect(supabase.from).toHaveBeenCalledWith('medications');
    expect(supabase.from('medications').insert).toHaveBeenCalledWith([
      {
        name: 'Paracetamol',
        dosage: '500',
        schedule: 'daily',
        user_id: 'test-user',
      },
    ]);
  });

  it('throws if getMedicationLogsInRange returns error', async () => {
    (supabase.from as any) = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnValue({ data: null, error: new Error('Fetch failed') }),
    }));

    await expect(
      service.getMedicationLogsInRange('user-id', '2024-01-01', '2024-01-10')
    ).rejects.toThrow('Fetch failed');
  });
});
