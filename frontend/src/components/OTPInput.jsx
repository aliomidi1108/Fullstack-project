function OTPInput({ values, onChange }) {
  return (
    <div className="flex items-center gap-3">
      {values.map((value, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(event) => onChange(index, event.target.value)}
          className="w-12 h-12 rounded-2xl border border-gray-300 text-center text-body-lg font-semibold text-text-primary focus:outline-none focus:border-primary"
        />
      ))}
    </div>
  )
}

export default OTPInput
