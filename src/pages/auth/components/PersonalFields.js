function PersonalFields({ prefix }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${prefix}-first-name`} className="auth-label">First name</label>
          <input id={`${prefix}-first-name`} name="first_name" autoComplete="given-name" required className="auth-input" />
        </div>
        <div>
          <label htmlFor={`${prefix}-last-name`} className="auth-label">Last name</label>
          <input id={`${prefix}-last-name`} name="last_name" autoComplete="family-name" required className="auth-input" />
        </div>
      </div>
      <div>
        <label htmlFor={`${prefix}-phone`} className="auth-label">Phone number</label>
        <input id={`${prefix}-phone`} name="phone" type="tel" autoComplete="tel" required className="auth-input" />
      </div>
    </>
  );
}

export default PersonalFields;
