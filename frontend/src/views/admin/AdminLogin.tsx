"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
    Lock,
    Mail,
    LogIn,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        e: FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await login(
                email,
                password
            );

            router.push("/admin");
        } catch (err: any) {
            setError(
                err.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="admin-login-brand">

                    <div className="admin-login-logo">
                        R
                    </div>

                    <span>
                        RADHIKA COPY HOUSE
                    </span>

                </div>

                <div className="admin-login-heading">

                    <h1>Admin Login</h1>

                    <p>
                        Sign in to manage your
                        stationery business.
                    </p>

                </div>

                {error && (
                    <div className="admin-login-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="admin-login-form"
                >

                    <div className="admin-login-field">

                        <label>Email Address</label>

                        <div className="admin-login-input">

                            <Mail size={17} />

                            <input
                                type="email"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    <div className="admin-login-field">

                        <label>Password</label>

                        <div className="admin-login-input">

                            <Lock size={17} />

                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="admin-login-spinner" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={17} />
                                Sign In
                            </>
                        )}

                    </button>

                </form>

                <div className="admin-login-footer">
                    Radhika Copy House · Admin Panel
                </div>

            </div>

        </div>
    );
}

export default AdminLogin;