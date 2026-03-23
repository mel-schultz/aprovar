/**
 * Exemplo: Formulário de login com toggle de senha usando ícones Phosphor
 */

"use client";

import { useState } from "react";
import { Envelope, Lock, Eye, EyeSlash, SignIn } from "@phosphor-icons/react";

export function LoginFormExample() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      {/* Email */}
      <div style={{ position: "relative" }}>
        <Envelope size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input type="email" placeholder="seu@email.com" style={{ paddingLeft: 40 }} />
      </div>

      {/* Senha */}
      <div style={{ position: "relative" }}>
        <Lock size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Sua senha"
          style={{ paddingLeft: 40, paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}
        >
          {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Submit */}
      <button type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <SignIn size={18} weight="bold" />
        Entrar
      </button>
    </form>
  );
}
