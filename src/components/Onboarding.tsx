import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setFarmerProfile } = useAppContext()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    bankCode: '',
    accountNumber: '',
  })
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      setError('First name, last name, and phone number are required.')
      return
    }

    setFarmerProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      bankCode: form.bankCode.trim() || undefined,
      accountNumber: form.accountNumber.trim() || undefined,
    })

    navigate('/farmer')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-slate-900 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M8 18C8 18 10 12 14 10C18 8 20 14 20 14" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <circle cx="14" cy="17" r="3" fill="#EDE4D5" />
              <circle cx="14" cy="17" r="1.5" fill="#0EA5E9" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900 mb-2">Create your farmer profile</h1>
          <p className="text-sm text-slate-500">Your details are used to process payments and build your trust score.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-900/[0.06] rounded-[24px] shadow-sm p-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aminu" required />
            <Field label="Last name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Yusuf" required />
          </div>

          <Field
            label="Phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+2348012345678"
            required
            hint="Used to look up your trust score"
          />

          <Field
            label="Email address"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="aminu@example.com"
            type="email"
          />

          <div className="border-t border-slate-100 pt-4">
            <div className="text-[11px] font-bold tracking-[0.06em] uppercase text-slate-400 mb-3">Payment details (optional)</div>
            <div className="flex flex-col gap-4">
              <Field
                label="Bank code"
                name="bankCode"
                value={form.bankCode}
                onChange={handleChange}
                placeholder="058 (GTBank)"
                hint="Required for automatic disbursement"
              />
              <Field
                label="Account number"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="0123456789"
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[10px] text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-[14px] bg-slate-900 text-white text-[15px] font-semibold rounded-[14px] border-0 cursor-pointer transition-all duration-[220ms] hover:bg-slate-800 hover:-translate-y-px mt-1"
          >
            Continue to dashboard
          </button>

          <p className="text-center text-xs text-slate-400">
            Already have a profile?{' '}
            <button type="button" className="text-sky-500 font-semibold border-0 bg-transparent cursor-pointer" onClick={() => navigate('/farmer')}>
              Go to dashboard
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  type?: string
  hint?: string
}

function Field({ label, name, value, onChange, placeholder, required, type = 'text', hint }: FieldProps) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-[6px]">
        {label}
        {required && <span className="text-sky-500 ml-[3px]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-[14px] py-[10px] text-sm text-slate-900 bg-white border-[1.5px] border-slate-200 rounded-[10px] outline-none transition focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] placeholder:text-slate-400"
      />
      {hint && <p className="text-[11px] text-slate-400 mt-[5px]">{hint}</p>}
    </div>
  )
}
