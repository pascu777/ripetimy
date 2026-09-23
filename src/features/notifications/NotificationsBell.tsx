import { useState } from 'react'
import { useNotifications, useMarkNotificationsRead } from './hooks'

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'adesso'
  if (minutes < 60) return `${minutes} min fa`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h fa`
  return `${Math.floor(hours / 24)} g fa`
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const notificationsQuery = useNotifications()
  const markRead = useMarkNotificationsRead()
  const notifications = notificationsQuery.data ?? []
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="relative">
      <button
        onClick={() => {
          const next = !open
          setOpen(next)
          if (next) {
            const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
            if (unreadIds.length > 0) markRead.mutate(unreadIds)
          }
        }}
        className="relative rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
        aria-label="Notifiche"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <p className="px-2 py-1 text-sm font-semibold text-slate-900">Notifiche</p>
            {notifications.length === 0 && <p className="px-2 py-3 text-sm text-slate-500">Nessuna notifica.</p>}
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`rounded-lg px-2 py-2 text-sm ${n.is_read ? '' : 'bg-indigo-50'}`}>
                  <p className="font-medium text-slate-900">{n.title}</p>
                  {n.body && <p className="text-slate-600">{n.body}</p>}
                  <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
