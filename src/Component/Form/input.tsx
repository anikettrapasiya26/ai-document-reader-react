export default function input(props: any) {
  const {
    handleChange,
    errorShow,
    value,
    errors,
    name,
    label,
    link,
    disabled,
    maxLength,
    className,
  } = props
  return (
    <div className='flex form-input-controller'>
      <label htmlFor={`${name}-box`} id={`${name}-label`} className={`${name}-label form__label`}>
        {label}
      </label>
      <input
        className={disabled ? `form__text ${className}` : `form__input name ${className}`}
        id={`${name}-box`}
        type={name === 'newPassword' ? 'password' : name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={`Enter ${label}`}
        disabled={disabled}
        maxLength={maxLength}
      />
      <p className='text-danger'>{errorShow ? errors : null}</p>
      {link && <a href={link.to}>{link.name}</a>}
    </div>
  )
}
