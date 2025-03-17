import "../styles/components/LoginForm.css";

// Dynamic form that allows users to login to or register their account 

export function LoginForm() {

  return (
    <form className="LoginForm">
      <section className="input-group">
        <div className="username-block">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="password-block">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
      </section>
      <section className="submit-group">
        <button>Register</button>
        <button>Login</button>
      </section>
    </form>
  )

};