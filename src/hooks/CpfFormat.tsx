'use client'
import { useState } from "react";

function useCPFMask() {
  const [cpf, setCpf] = useState("");

  const maskCPF = (value: string) => {
    value = value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const applyMaskToCPF = (value: string) => {
    return maskCPF(value);
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.currentTarget.value);
    setCpf(maskedValue);
  };

  return {
    cpf,
    handleChange,
    applyMaskToCPF
  };
}

export default useCPFMask;
