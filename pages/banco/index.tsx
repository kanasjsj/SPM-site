import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";
import ModalConfig from "./components/modals/ModalConfig";
import Loading from "../Loading";

const Banco = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [saldo, setSaldo] = useState(0);
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Verifica a configuração do usuário
  const checkConfiguration = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("nome_completo, data_nascimento")
        .eq("id", user.id)
        .single();

      if (error || !data?.nome_completo || !data?.data_nascimento) {
        setIsConfigured(false);
        setShowModal(true);
      } else {
        setIsConfigured(true);
      }
    } catch (err) {
      console.error("Erro ao verificar configuração:", err);
    } finally {
      setLoading(false);
    }
  };

  // Busca o saldo
  const fetchSaldo = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("transacoes")
        .select("valor")
        .eq("usuario_id", user.id);

      if (error) {
        console.error("Erro ao buscar saldo:", error);
        return;
      }

      const total = data.reduce((acc, transacao) => acc + transacao.valor, 0);
      setSaldo(total);
    } catch (err) {
      console.error("Erro ao calcular saldo:", err);
    }
  };

  useEffect(() => {
    if (user) {
      checkConfiguration();
    }
  }, [user]);

  useEffect(() => {
    if (isConfigured) {
      fetchSaldo();
    }
  }, [isConfigured]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      {showModal && <ModalConfig onClose={() => setShowModal(false)} />}
      {isConfigured ? (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Bem-vindo, {user?.username || "Usuário"}!</h1>
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Saldo Disponível:</h2>
            <p className="text-4xl font-bold text-blue-500">R$ {saldo.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-xl font-semibold">
            Por favor, configure sua conta para acessar o banco.
          </h1>
        </div>
      )}
    </Layout>
  );
};

export default Banco;