/**
 * Exemplo: Formulário de login com toggle de senha — AprovaAí
 * Este componente usa estado, portanto precisa de "use client"
 */

"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export function LoginFormExample() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      {/* Email */}
      <div style={{ position: "relative" }}>
        <Mail
          size={18}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="email"
          placeholder="seu@email.com"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* Senha */}
      <div style={{ position: "relative" }}>
        <Lock
          size={18}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Sua senha"
          style={{ paddingLeft: 40, paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <LogIn size={18} />
        Entrar
      </button>
    </form>
  );
}
