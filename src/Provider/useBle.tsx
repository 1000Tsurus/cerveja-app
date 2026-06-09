import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { BleManager, Device, BleErrorCode } from "react-native-ble-plx";
import base64 from "react-native-base64";
import { useTank } from "../context/TankContext";

const bleManager = Platform.OS !== 'web' ? new BleManager() : null;

const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const CHARACTERISTIC_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const CHARACTERISTIC_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

// Tipagem do Contexto
type BleContextType = {
  dispositivoConectado: Device | null;
  estaEscaneando: boolean;
  statusConexao: string;
  iniciarEscaneamento: () => void;
  enviarComandoPino: (valor: string) => Promise<void>;
};

const BleContext = createContext<BleContextType | null>(null);

async function requisitarPermissoesAndroid() {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else if (Platform.Version >= 23) {
      const checkLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!checkLocation) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }
  }
  return true;
}

export function BleProvider({ children }: { children: ReactNode }) {
  const { processamentoDeDados } = useTank();
  const [dispositivoConectado, setDispositivoConectado] = useState<Device | null>(null);
  const [estaEscaneando, setEstaEscaneando] = useState(false);
  const [statusConexao, setStatusConexao] = useState("Desconectado");

  useEffect(() => {
    requisitarPermissoesAndroid();
    // NÃO podemos colocar stopDeviceScan aqui no unmount do Provider, 
    // senão ele mata a conexão se o app recarregar
  }, []);

  const conectarAoDispositivo = useCallback(async (device: Device) => {
    try {
      const conectado = await device.connect();
      setStatusConexao("Descobrindo serviços...");

      const servicosEcaracteristicas = await conectado.discoverAllServicesAndCharacteristics();
      setDispositivoConectado(servicosEcaracteristicas);
      setStatusConexao("Conectado");

      bleManager?.onDeviceDisconnected(device.id, (error, disconnectedDevice) => {
        console.warn("ESP32 Desconectado", error);
        setStatusConexao("Desconectado");
        setDispositivoConectado(null);
      });

      servicosEcaracteristicas.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_TX,
        (error, char) => {
          if (error) {
            console.error("Erro no monitoramento TX:", error);
            return;
          }
          if (char?.value) {
            const dadosRecebidos = base64.decode(char.value);
            processamentoDeDados(dadosRecebidos);
          }
        }
      );
    } catch (e) {
      console.error("Erro na conexão:", e);
      setStatusConexao("Falha na conexão");
      setDispositivoConectado(null);
    }
  }, [processamentoDeDados]);

  const iniciarEscaneamento = useCallback(() => {
    if (estaEscaneando) return;

    setEstaEscaneando(true);
    setStatusConexao("Escaneando...");

    bleManager?.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Erro ao escanear:", error);
        setEstaEscaneando(false);

        if (error.errorCode === BleErrorCode.BluetoothPoweredOff) {
          setStatusConexao("Bluetooth desligado");
        } else if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
          setStatusConexao("Erro de Permissão");
        } else {
          setStatusConexao("Erro na busca");
        }
        return;
      }

      if (device && (device.name === 'ESP32-Cerveja' || device.localName === 'ESP32-Cerveja')) {
        bleManager?.stopDeviceScan();
        setEstaEscaneando(false);
        setStatusConexao("Conectando...");
        conectarAoDispositivo(device);
      }
    });
  }, [estaEscaneando, conectarAoDispositivo]);

  const enviarComandoPino = useCallback(async (valor: string) => {
    if (!dispositivoConectado) {
      console.warn("Nenhum dispositivo conectado para enviar comando.");
      return;
    }
    const comandoBase64 = base64.encode(valor);
    try {
      await dispositivoConectado.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_RX,
        comandoBase64
      );
      console.log(`Comando enviado via BLE: ${valor}`);
    } catch (error) {
      console.error("Erro ao enviar comando via BLE:", error);
    }
  }, [dispositivoConectado]);

  const contextValue = useMemo(() => ({
    dispositivoConectado,
    estaEscaneando,
    statusConexao,
    iniciarEscaneamento,
    enviarComandoPino
  }), [dispositivoConectado, estaEscaneando, statusConexao, iniciarEscaneamento, enviarComandoPino]);

  return (
    <BleContext.Provider value={contextValue} >
      {children}
    </BleContext.Provider>
  );
}

// Hook para usar em qualquer tela
export function useBle() {
  const context = useContext(BleContext);
  if (!context) {
    throw new Error("useBle deve ser usado dentro de um BleProvider");
  }
  return context;
}
