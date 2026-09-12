import { useEffect, useState } from 'react'
import userIcon from '../../assets/icons/user.png'
import { useAuth } from '../../context/AuthContext'
import { updateMe } from '../../services/auth.service'
import { uploadAvatarToCloud } from '../../services/storage.service'

function EditProfile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setAvatarUrl(user?.avatar || '')
  }, [user])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('')
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setSelectedFile(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('فرمت تصویر معتبر نیست.')
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
    setError('')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')
    try {
      let nextAvatarUrl = avatarUrl
      if (selectedFile) {
        nextAvatarUrl = await uploadAvatarToCloud(selectedFile)
      }

      const payload = {}
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()
      if (trimmedName) payload.name = trimmedName
      if (trimmedEmail) payload.email = trimmedEmail
      payload.avatar = nextAvatarUrl || null

      const updatedUser = await updateMe(payload)
      updateUser(updatedUser)
      setAvatarUrl(updatedUser?.avatar || '')
      setSelectedFile(null)
      setSuccess('پروفایل با موفقیت به‌روزرسانی شد.')
    } catch (err) {
      setError(err?.response?.data?.message || 'به‌روزرسانی پروفایل ناموفق بود.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-section-title font-semibold text-text-primary mb-6 text-right">
        ویرایش پروفایل
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={previewUrl || avatarUrl || userIcon}
            alt="آواتار"
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
          <label className="px-4 py-2 rounded-2xl border border-gray-300 text-body-md text-text-primary cursor-pointer">
            انتخاب آواتار
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        <p className="text-body-md text-text-secondary text-right">
          تصویر پروفایل در فضای ابری ذخیره می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
        />
        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          placeholder="شماره موبایل"
          value={user?.phone || ''}
          readOnly
          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-body-md text-text-secondary"
        />
      </div>

      {error ? <p className="text-body-md text-red-500 mb-4">{error}</p> : null}
      {success ? <p className="text-body-md text-green-600 mb-4">{success}</p> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-8 py-3 rounded-2xl border border-primary text-primary text-body-md font-semibold disabled:opacity-70"
      >
        {isSubmitting ? 'در حال ذخیره...' : 'ویرایش'}
      </button>
    </div>
  )
}

export default EditProfile
