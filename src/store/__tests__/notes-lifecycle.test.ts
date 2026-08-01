import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/actions/sync-progress', () => ({
  syncModuleProgress: vi.fn(async () => ({ success: true })),
  logProgressEvent: vi.fn(async () => ({ success: true })),
}));

import { useNotesStore } from '@/store/notes';
import { clearMemoryStorage } from '@/store/user-storage';

describe('notes store lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearMemoryStorage();
    useNotesStore.setState({ userId: null, notes: [] });
  });

  it('clearUserStore keeps notes for a re-emitted same-user auth event', () => {
    useNotesStore.getState().clearUserStore('u1');
    useNotesStore.getState().saveNote('1', 0, 0, 'draft note');

    expect(useNotesStore.getState().notes.length).toBeGreaterThan(0);

    useNotesStore.getState().clearUserStore('u1');

    expect(useNotesStore.getState().userId).toBe('u1');
    expect(useNotesStore.getState().notes.length).toBeGreaterThan(0);
  });

  it('clearUserStore switches users to a fresh canvas without in-memory bleed', () => {
    useNotesStore.getState().clearUserStore('u1');
    useNotesStore.getState().saveNote('1', 0, 0, 'u1 note');

    useNotesStore.getState().clearUserStore('u2');

    expect(useNotesStore.getState().userId).toBe('u2');
    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('clearUserStore(null) resets to a guest canvas', () => {
    useNotesStore.getState().clearUserStore('u1');
    useNotesStore.getState().saveNote('1', 0, 0, 'u1 note');

    useNotesStore.getState().clearUserStore(null);

    expect(useNotesStore.getState().userId).toBeNull();
    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('syncFromDB merges DB notes with local notes', () => {
    useNotesStore.getState().clearUserStore('u1');
    useNotesStore.getState().saveNote('1', 0, 0, 'local note');

    useNotesStore.getState().syncFromDB([
      {
        id: 'db-1',
        moduleId: '1',
        lessonIndex: 0,
        slideIndex: 0,
        content: 'db note newer',
        updatedAt: '2099-01-02T00:00:00.000Z',
      },
      {
        id: 'db-2',
        moduleId: '1',
        lessonIndex: 1,
        slideIndex: 2,
        content: 'remote only',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    const notes = useNotesStore.getState().notes;
    expect(notes).toHaveLength(2);
    const sameSlot = notes.find((n) => n.moduleId === '1' && n.lessonIndex === 0 && n.slideIndex === 0);
    expect(sameSlot?.content).toBe('db note newer');
    expect(notes.some((n) => n.content === 'remote only')).toBe(true);
  });

  it('saveNote pushes the note to the DB sync', async () => {
    useNotesStore.getState().clearUserStore('u1');
    useNotesStore.getState().saveNote('1', 0, 0, 'fresh session note');

    await useNotesStore.getState().flushSyncNotes();

    const { syncModuleProgress } = await import('@/actions/sync-progress');
    expect(syncModuleProgress).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        notes: expect.arrayContaining([expect.objectContaining({ content: 'fresh session note' })]),
      })
    );
  });

  it('does not push an empty notes payload that would clobber DB notes', async () => {
    useNotesStore.getState().clearUserStore('u1');

    await useNotesStore.getState().syncToDB('1');

    const { syncModuleProgress } = await import('@/actions/sync-progress');
    expect(syncModuleProgress).not.toHaveBeenCalled();
  });

  it('restores per-user notes after a same-session logout/login', async () => {
    useNotesStore.getState().clearUserStore('rehyd-n');
    await flush();
    useNotesStore.getState().saveNote('1', 0, 0, 'persisted note');
    expect(useNotesStore.getState().notes.length).toBeGreaterThan(0);

    useNotesStore.getState().clearUserStore(null);
    await flush();
    expect(useNotesStore.getState().notes).toEqual([]);

    useNotesStore.getState().clearUserStore('rehyd-n');
    await flush();
    expect(useNotesStore.getState().notes.some((n) => n.content === 'persisted note')).toBe(true);
  });
});

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
