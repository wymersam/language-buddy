import { useState } from "react";
import { User, Edit2, Save, Trash2 } from "lucide-react";
import type { User as UserType } from "../../types";
import { clearAllData } from "../../utils/storage";

interface ProfileViewProps {
  user: UserType;
  setUser: (user: UserType) => void;
}

export default function ProfileView({ user, setUser }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This will delete your chat history, exercises, and reset your profile.",
      )
    ) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <h1 className="profile-title">Profile</h1>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              <Edit2 size={18} />
              <span>Edit</span>
            </button>
          ) : (
            <div className="profile-actions">
              <button onClick={handleSave} className="save-button">
                <Save size={18} />
                <span>Save</span>
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section avatar-section">
          <div className="avatar">
            <User size={60} className="text-white" />
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
              className="name-input"
            />
          ) : (
            <h2 className="name-display">{user.name}</h2>
          )}
          <div className="level-badge">{user.level} Level</div>
        </div>

        <div className="profile-section language-section">
          <h3 className="section-title">🌍 Language Settings</h3>

          <div className="form-group">
            <label className="form-label">Target Language</label>
            {isEditing ? (
              <select
                value={editedUser.targetLanguage}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    targetLanguage: e.target.value,
                  })
                }
                className="form-select"
              >
                <option value="German">German</option>
                <option value="Spanish">Spanish (not implemented)</option>
                <option value="French">French (not implemented)</option>
                <option value="Italian">Italian (not implemented)</option>
              </select>
            ) : (
              <div className="form-display">
                <p className="form-display-text">{user.targetLanguage}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Native Language</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.nativeLanguage}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    nativeLanguage: e.target.value,
                  })
                }
                className="form-input"
              />
            ) : (
              <div className="form-display">
                <p className="form-display-text">{user.nativeLanguage}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Learning Level</label>
            {isEditing ? (
              <select
                value={editedUser.level}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    level: e.target.value as
                      | "A1"
                      | "A2"
                      | "B1"
                      | "B2"
                      | "C1"
                      | "C2",
                  })
                }
                className="form-select"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            ) : (
              <div className="form-display">
                <p className="form-display-text capitalize">{user.level}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Response Language</label>
            {isEditing ? (
              <select
                value={editedUser.responseLanguage}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    responseLanguage: e.target.value as
                      | "bilingual"
                      | "german-only",
                  })
                }
                className="form-select"
              >
                <option value="bilingual">Bilingual (German + English)</option>
                <option value="german-only">German Only</option>
              </select>
            ) : (
              <div className="form-display">
                <p className="form-display-text">
                  {user.responseLanguage === "bilingual"
                    ? "Bilingual (German + English)"
                    : "German Only"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section areas-section">
          <h3 className="section-title">📚 Learning Areas</h3>

          <div className="areas-group">
            <label className="areas-label">📈 Areas to Improve</label>
            <div className="tags-container">
              {user.weakAreas.map((area, index) => (
                <span key={index} className="tag weakness">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="areas-group">
            <label className="areas-label">✨ Strengths</label>
            <div className="tags-container">
              {user.strengths.map((strength, index) => (
                <span key={index} className="tag strength">
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-section danger-section">
          <h3 className="section-title">⚠️ Data Management</h3>
          <p className="danger-description">
            Clear all saved data including chat history, exercises, and profile
            settings.
          </p>
          <button onClick={handleClearData} className="danger-button">
            <Trash2 size={18} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
