import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
<<<<<<< HEAD
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("employee", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <h1>DAYFLOW</h1>
        <p>HRMS</p>
      </div>

      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
=======
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Save authentication information
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('employee', JSON.stringify(data.employee))

      // Tell App.jsx that login succeeded
      onLogin(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-indigo-600 text-2xl font-bold text-white">
            D
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            DayFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            HR Management System
          </p>

        </div>

        {/* Login */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@dayflow.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Demo credentials */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">

          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Demo Admin Account
          </p>

          <p className="text-sm text-gray-700">
            Email: <strong>admin@dayflow.com</strong>
          </p>

          <p className="text-sm text-gray-700">
            Password: <strong>Admin@123</strong>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login
>>>>>>> origin/main
