import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

type TankContextType = {
  currentLiters: number;
  maxLiters: number;
  percentage: number;
  litersConsumed: number;
  temperaturaAtual: number;
  statusTanque: string;
  ultimaAtualizacao: string;
  serveBeer: (ml: number) => void;
  processamentoDeDados: (dado: string) => void;
};

const TankContext = createContext<TankContextType | null>(null);

const MAX_LITERS = 20;

export function TankProvider({ children }: { children: ReactNode }) {
  const [currentLiters, setCurrentLiters] = useState(MAX_LITERS);

  // Estados de Telemetria
  const [temperaturaAtual, setTemperaturaAtual] = useState<number>(0.0);
  const [statusTanque, setStatusTanque] = useState<string>("Desconectado");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>("Sem leituras");

  // Cálculos derivados (auto-atualizáveis)
  const percentage = (currentLiters / MAX_LITERS) * 100;
  const litersConsumed = MAX_LITERS - currentLiters;

  const serveBeer = useCallback((ml: number) => {
    setCurrentLiters((prev) => {
      const updated = prev - (ml / 1000);
      return updated < 0 ? 0 : updated;
    });
  }, []);

  const capturarTimestamp = useCallback(() => {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  // O "Parser" que interpreta o que o ESP32 manda
  const processamentoDeDados = useCallback(
    (dado: string) => {
      const dadoLimpo = dado.trim();
      if (!dadoLimpo) return;

      const partes = dadoLimpo.split(":");
      if (partes.length !== 2) return;

      const [prefixo, valor] = partes;

      switch (prefixo) {
        case "CONSUMO": {
          const ml = parseInt(valor, 10);
          if (!isNaN(ml)) {
            serveBeer(ml);
            setUltimaAtualizacao(capturarTimestamp());
          }
          break;
        }
        case "TEMP": {
          const temp = parseFloat(valor);
          if (!isNaN(temp)) {
            setTemperaturaAtual(temp);
            setUltimaAtualizacao(capturarTimestamp());
          }
          break;
        }
        case "STATUS": {
          setStatusTanque(valor);
          setUltimaAtualizacao(capturarTimestamp());
          break;
        }
      }
    },
    [serveBeer, capturarTimestamp]
  );

  const contextValue = useMemo(
    () => ({
      currentLiters,
      maxLiters: MAX_LITERS,
      percentage,
      litersConsumed,
      temperaturaAtual,
      statusTanque,
      ultimaAtualizacao,
      serveBeer,
      processamentoDeDados,
    }),
    [
      currentLiters,
      percentage,
      litersConsumed,
      temperaturaAtual,
      statusTanque,
      ultimaAtualizacao,
      serveBeer,
      processamentoDeDados,
    ]
  );

  return (
    <TankContext.Provider value={contextValue}>
      {children}
    </TankContext.Provider>
  );
}

export function useTank() {
  const context = useContext(TankContext);
  if (!context) {
    throw new Error("useTank deve ser usado dentro de um TankProvider");
  }
  return context;
}