import React, { useEffect, useRef, useState } from 'react';
import UserApi from '../../entities/user/UserApi';

export default function ProfileEditor({ user, setUser }) {
  //   const [name, setName] = useState(user.name || '');
  //   const [email, setEmail] = useState(user.email || '');
  //   const [userSave, setUserSave] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatarUrl || '/public/'
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const proFile = async () => {
      try {
        const data = await UserApi.getOne(user.id);
        console.log(data.data);
        setUser(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    proFile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = Object.fromEntries(new FormData(e.target));
      console.log(data);

      const updated = await UserApi.update(user.id, data);
      setUser(updated.data);
      alert('Профиль обновлён!');
    } catch {
      alert('Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file =
      e.dataTransfer && e.dataTransfer.files.length
        ? e.dataTransfer.files[0]
        : e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);
    try {
      const { avatarUrl } = await UserApi.uploadAvatar(formData);
      setAvatarPreview(avatarUrl);
      setUser((prev) => ({ ...prev, avatarUrl }));
      alert('Фото профиля обновлено!');
    } catch {
      alert('Ошибка загрузки фото');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-6 bg-white rounded-2xl shadow mb-10 border">
      <div
        style={{
          border: '2px dashed gray',
          padding: 16,
          width: 128,
          height: 128,
          position: 'relative',
          marginBottom: 16,
          cursor: 'pointer',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        title="Клик или drag'n'drop для смены аватара"
      >
        <img
          src={`${user.avatarUrl}`}
          alt="Аватар"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
           
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleDrop}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 3,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#555',
            fontSize: 12,
            background: 'rgba(255,255,255,0.48)',
          }}
        >
          Drag'n'drop
        </div>
      </div>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label>
            Имя:
            <br />
            <input
              defaultValue={user.name}
              name="name"
              required
              disabled={loading}
              className="border rounded px-3 py-2 w-full"
            />
          </label>
        </div>
        <div className="mb-3">
          <label>
            Почта:
            <br />
            <input
              defaultValue={user.email}
              name="email"
              type="email"
              required
              disabled={loading}
              className="border rounded px-3 py-2 w-full"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
