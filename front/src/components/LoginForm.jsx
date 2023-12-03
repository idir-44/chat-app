import "./LoginForm.css";

export default function LoginForm() {
  return (
    <div className="page">
      <div className="cover">
        <h1>Chat App</h1>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />

        <button className="loginButton">Login</button>
      </div>
    </div>
  );
}
