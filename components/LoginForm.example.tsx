/**
 * Exemplo: Formulário de login com ícones Phosphor
 * Mostra uso de Eye/EyeSlash para toggle de senha
 */

"use client";

import { useState } from "react";
import {
  Envelope as IconEmail,
  Lock as IconLock,
  Eye as IconEye,
  EyeSlash as IconEyeSlash,
  SignIn as IconLogin,
} from "@phosphor-icons/react";

export function LoginFormExample() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      {/* Campo Email */}
      <div style={{ position: "relative" }}>
        <IconEmail
          size={18}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
        />
        <input
          type="email"
          placeholder="seu@email.com"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* Campo Senha com toggle */}
      <div style={{ position: "relative" }}>
        <IconLock
          size={18}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Sua senha"
          style={{ paddingLeft: 40, paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}
        >
          {showPassword ? <IconEyeSlash size={18} /> : <IconEye size={18} />}
        </button>
      </div>

      {/* Botão submit */}
      <button type="submit">
        <IconLogin size={18} weight="bold" />
        Entrar
      </button>
    </form>
  );
}
