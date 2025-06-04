import React, { useState } from "react";
import api from '../api/axios';

export default function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    secondName: "",
    surname: ""
  });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setForm({
      email: "",
      password: "",
      passwordConfirmation: "",
      name: "",
      secondName: "",
      surname: ""
    });
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "signup" : "login";
    const payload = isRegister
      ? {
          user: {
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation,
            name: form.name,
            second_name: form.secondName,
            surname: form.surname
          }
        }
      : {
          email: form.email,
          password: form.password
        };

    try {
      api.post(endpoint, payload)
        .then(response => { onAuthSuccess(response.data.token, response.data.user); })
        .catch((e) => { setError(e.message || "Something went wrong"); });
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {isRegister && (
          <>
            <input
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              value={form.passwordConfirmation}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="secondName"
              placeholder="Second Name"
              value={form.secondName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={form.surname}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="text-blue-600 underline"
          onClick={toggleMode}
          type="button"
        >
          {isRegister ? "Login here" : "Register here"}
        </button>
      </p>
    </div>
  );
}
