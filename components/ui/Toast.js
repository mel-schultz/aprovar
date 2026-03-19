'use client'

import toast from 'react-hot-toast'

export const notify = {
  success: (msg) => toast.success(msg),
  error:   (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  promise: (promise, msgs) => toast.promise(promise, msgs),
  dismiss: (id)  => toast.dismiss(id),
}

export default notify
