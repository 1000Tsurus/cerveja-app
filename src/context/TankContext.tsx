import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";

// Inicializa o gerenciador do Bluetooth
const bleManager = new BleManager();

// UUIDs configurados no firmware do ESP32
const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const CHARACTERISTIC_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // O app escreve aqui
const CHARACTERISTIC_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // O app escuta aqui

type TankContextType = {
  currentLiters: number;
  maxLiters: number;
  percentage: number;
  litersConsumed: number;
  temperaturaAtual: number;
  statusTanque: string;
  ultimaAtualizacao: string;
  serveBeer: (ml: number) => void;
  // Novas propriedades do Bluetooth:
  dispositivoConectado: Device | null;
  estaEscaneando: boolean;
  statusConexao: string;
  iniciarEscaneamento: () => void;
  enviarComandoLed: (tempoMs: number) => Promise<void>;
};

const TankContext = createContext<TankContextType | null>(null);

// Função para solicitar permissões no Android (Obrigatório a partir do Android 6+)
async function requisitarPermissoesAndroid() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    const checkLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (!checkLocation) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
  }
}

export function TankProvider({
  children,
}: {
  children: ReactNode;
}) {
  // --- Estados originais do seu projeto ---
  const maxLiters = 20;
  const [currentLiters, setCurrentLiters] = useState(maxLiters);
  const percentage = (currentLiters / maxLiters) * 100;

  // --- Novos estados para o Bluetooth ---
  const [dispositivoConectado, setDispositivoConectado] = useState<Device | null>(null);
  const [estaEscaneando, setEstaEscaneando] = useState(false);
  const [statusConexao, setStatusConexao] = useState("Desconectado");

  // Solicita permissões ao carregar o Provider
  useEffect(() => {
    requisitarPermissoesAndroid();
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  // --- Função original do seu projeto ---
  function serveBeer(ml: number) {
    const litersToRemove = ml / 1000;

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

  // --- Novas funções de controle Bluetooth ---

  const iniciarEscaneamento = () => {
    if (estaEscaneando) return;

    setEstaEscaneando(true);
    setStatusConexao("Escaneando...");

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Erro ao escanear:", error);
        setEstaEscaneando(false);
        setStatusConexao("Erro ao escanear");
        return;
      }

      // Procura o ESP32 pelo nome definido no código C++
      if (device && (device.name === 'ESP32-Cerveja' || device.localName === 'ESP32-Cerveja')) {
        bleManager.stopDeviceScan();
        setEstaEscaneando(false);
        setStatusConexao("Conectando...");
        conectarAoDispositivo(device);
      }
    });
  };

  const conectarAoDispositivo = async (device: Device) => {
    try {
      const conectado = await device.connect();
      setStatusConexao("Descobrindo serviços...");

      const servicosEcaracteristicas = await conectado.discoverAllServicesAndCharacteristics();
      setDispositivoConectado(servicosEcaracteristicas);
      setStatusConexao("Conectado (GPIO 2)");

      // Escuta os retornos (logs) enviados pelo ESP32 no canal TX
      servicosEcaracteristicas.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_TX,
        (error, char) => {
          if (char?.value) {
            const dadosRecebidos = atob(char.value);
            console.log("Retorno do ESP32:", dadosRecebidos);
          }
        }
      );

    } catch (e) {
      console.error("Erro na conexão:", e);
      setStatusConexao("Falha na conexão");
      setDispositivoConectado(null);
    }
  };

  const enviarComandoLed = async (tempoMs: number) => {
    if (!dispositivoConectado) {
      alert("Nenhum dispositivo ESP32 conectado!");
      return;
    }

    // Monta a string no novo formato "LIGAR:TEMPO" e converte para Base64
    const comandoStr = `LIGAR:${tempoMs}`;
    const comandoBase64 = btoa(comandoStr);

    try {
      await dispositivoConectado.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_RX,
        comandoBase64
      );
      console.log(`Comando enviado: ${comandoStr}`);
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      alert("Erro ao comunicar com o ESP32.");
    }
  };

  return (
    <TankContext.Provider
      value={{
        currentLiters,
        maxLiters,
        percentage,
        serveBeer,
        // Repassando as novas propriedades no value
        dispositivoConectado,
        estaEscaneando,
        statusConexao,
        iniciarEscaneamento,
        enviarComandoLed,
      }}
    >
      {children}
    </TankContext.Provider>
  );
}

export function useTank() {
  return useContext(TankContext);
}
