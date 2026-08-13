import { DEMO_USERS, roleLabel } from '../data/auth'
import { useStore } from '../data/useStore'

export function RoleSwitcher() {
  const { state, setDemoUser } = useStore()
  const current = state.currentUser

  return (
    <label className="role-switcher">
      <span className="role-switcher__label">Role</span>
      <select
        aria-label="Demo role"
        value={current.id}
        onChange={(e) => {
          const user = DEMO_USERS.find((u) => u.id === e.target.value)
          if (user) setDemoUser(user)
        }}
      >
        {DEMO_USERS.map((user) => (
          <option key={user.id} value={user.id}>
            {roleLabel(user.role)} — {user.name}
          </option>
        ))}
      </select>
    </label>
  )
}
