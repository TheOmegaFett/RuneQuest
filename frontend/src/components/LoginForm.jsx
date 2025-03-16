// Dynamic form that allows users to login to or register their account 

export function LoginForm() {
    return (
        <section className="LoginForm">
        <h2>Login</h2>
        <form>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button>Login</button>
        </form>
      </section>
    )
};