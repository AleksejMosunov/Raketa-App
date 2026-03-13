import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router';
import type { Track } from '~/src/model/Track';
import { TrackService } from '~/src/services/trackService';
import { useAuthStore } from '~/src/store/useAuthStore';
import './styles.css';

type TrackForm = {
  name: string;
  wsUrl: string;
  httpPort: string;
  officialTiming: string;
  imgUrl: string;
  openedWs: boolean;
};

const trackService = new TrackService();

const initialForm: TrackForm = {
  name: '',
  wsUrl: '',
  httpPort: '',
  officialTiming: '',
  imgUrl: '',
  openedWs: false,
};

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [form, setForm] = useState<TrackForm>(initialForm);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const isEditing = Boolean(editingTrackId);

  const panelTitle = useMemo(() => {
    return isEditing ? 'Edit Track' : 'Create Track';
  }, [isEditing]);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    const loadTracks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await trackService.fetchTracks();
        setTracks(data);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Failed to load tracks';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [isAdmin]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const clearForm = () => {
    setForm(initialForm);
    setEditingTrackId(null);
  };

  const handleEdit = (track: Track) => {
    setEditingTrackId(track._id);
    setForm({
      name: track.name,
      wsUrl: track.wsUrl,
      httpPort: String(track.httpPort),
      officialTiming: track.officialTiming,
      imgUrl: track.imgUrl,
      openedWs: track.openedWs,
    });
    setError(null);
  };

  const handleDelete = async (trackId: string) => {
    const confirmed = window.confirm('Delete this track?');
    if (!confirmed) return;

    setError(null);
    try {
      await trackService.deleteTrack(trackId);
      setTracks((previous) => previous.filter((item) => item._id !== trackId));
      if (editingTrackId === trackId) {
        clearForm();
      }
    } catch (removeError) {
      const message = removeError instanceof Error ? removeError.message : 'Failed to delete track';
      setError(message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      wsUrl: form.wsUrl.trim(),
      httpPort: Number(form.httpPort),
      officialTiming: form.officialTiming.trim(),
      imgUrl: form.imgUrl.trim(),
      openedWs: form.openedWs,
    };

    if (!payload.name || !payload.wsUrl || !payload.officialTiming || !payload.imgUrl) {
      setError('Please fill all required fields.');
      return;
    }

    if (!Number.isFinite(payload.httpPort) || payload.httpPort <= 0) {
      setError('HTTP port must be a positive number.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (editingTrackId) {
        const updated = await trackService.updateTrack(editingTrackId, payload);
        setTracks((previous) =>
          previous.map((item) => (item._id === editingTrackId ? updated : item)),
        );
      } else {
        const created = await trackService.createTrack(payload);
        setTracks((previous) => [created, ...previous]);
      }
      clearForm();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save track';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <section className="admin-page">
        <div className="admin-guard">
          <h1>Checking Session...</h1>
          <p>Please wait a moment.</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="admin-page">
        <div className="admin-guard">
          <h1>Admin Access</h1>
          <p>Please log in first.</p>
          <Link to="/login" className="admin-link">Go to Login</Link>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="admin-page">
        <div className="admin-guard">
          <h1>Access Denied</h1>
          <p>Your account does not have admin role.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-head">
        <p className="admin-kicker">Admin</p>
        <h1>Track Management</h1>
        <p>Create, update and delete race tracks from one place.</p>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-grid">
        <div className="admin-card">
          <h2>{panelTitle}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} placeholder="Track name" />
            </label>
            <label>
              WebSocket URL
              <input name="wsUrl" value={form.wsUrl} onChange={handleChange} placeholder="ws://..." />
            </label>
            <label>
              HTTP Port
              <input name="httpPort" value={form.httpPort} onChange={handleChange} placeholder="8080" />
            </label>
            <label>
              Official Timing URL
              <input name="officialTiming" value={form.officialTiming} onChange={handleChange} placeholder="https://..." />
            </label>
            <label>
              Image URL
              <input name="imgUrl" value={form.imgUrl} onChange={handleChange} placeholder="https://..." />
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="openedWs" checked={form.openedWs} onChange={handleChange} />
              Race started
            </label>

            <div className="admin-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Track'}
              </button>
              {isEditing && (
                <button type="button" className="ghost" onClick={clearForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2>Existing Tracks</h2>
          {isLoading ? (
            <p>Loading tracks...</p>
          ) : tracks.length === 0 ? (
            <p>No tracks found.</p>
          ) : (
            <ul className="admin-list">
              {tracks.map((track) => (
                <li key={track._id}>
                  <div>
                    <strong>{track.name}</strong>
                    <p>{track.wsUrl}</p>
                  </div>
                  <div className="row-actions">
                    <button type="button" className="small" onClick={() => handleEdit(track)}>
                      Edit
                    </button>
                    <button type="button" className="small danger" onClick={() => handleDelete(track._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
