import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react"; 
import supabase from "@/utils/supabase";

const ModalConfig = ({ onClose }) => {
  const { user: clerkUser } = useClerk();
  const [form, setForm] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { nomeCompleto, dataNascimento, password } = form;

    if (!nomeCompleto || nomeCompleto.length < 3) {
      return "Nome completo deve ter pelo menos 3 caracteres.";
    }
    if (!dataNascimento) {
      return "Data de nascimento é obrigatória.";
    }
    if (!password || password.length !== 4 || isNaN(password)) {
      return "Senha deve ter exatamente 4 dígitos numéricos.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { error: userError } = await supabase
        .from("users")
        .upsert({
          id: clerkUser.id,
          nome_completo: form.nomeCompleto,
          data_nascimento: form.dataNascimento,
          usuario: clerkUser.username || `user_${clerkUser.id}`,
        });

      if (userError) throw userError;

      const { error: transactionError } = await supabase.from("transacoes").insert({
        usuario_id: clerkUser.id,
        tipo: "depósito inicial",
        valor: 1200,
        data: new Date(),
        descricao: "Bônus de boas-vindas",
        password: form.password,
      });

      if (transactionError) throw transactionError;

      onClose();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      setError("Erro ao salvar. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[95%] max-w-md">
        <h2 className="text-2xl text-gray-300 font-bold mb-6">Complete Seu Cadastro</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nomeCompleto" className="text-gray-300 block">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              className="w-full p-2 border rounded bg-transparent text-gray-400 focus:outline-none"
              value={form.nomeCompleto}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="dataNascimento" className="text-gray-300 block">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              className="w-full p-2 border rounded bg-transparent text-gray-400 focus:outline-none"
              value={form.dataNascimento}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-300 block">Senha (4 dígitos)</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border rounded bg-transparent text-gray-400 focus:outline-none"
              value={form.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalConfig;