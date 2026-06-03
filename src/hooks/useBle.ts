import { useState, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { BleManager, Device, BleErrorCode } from "react-native-ble-plx";
import { useTank } from "../context/TankContext"; // Importa o contexto puro para injetar dados

const bleManager = Platform.OS !== 'web' ? new BleManager() : null;


const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const CHARACTERISTIC_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const CHARACTERISTIC_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

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

export function useBle() {
  const { ProcessamentoDeDados } = useTank(); // Consome o ponto de entrada de dados do tanque
  const [dispositivoConectado, setDispositivoConectado] = useState<Device | null>(null);
  const [estaEscaneando, setEstaEscaneando] = useState(false);
  const [statusConexao, setStatusConexao] = useState("Desconectado");

  useEffect(() => {
    requisitarPermissoesAndroid();
    return () => {
      bleManager?.stopDeviceScan();
    };
  }, []);

  const conectarAoDispositivo = async (device: Device) => {
    try {
      const conectado = await device.connect();
      setStatusConexao("Descobrindo serviços...");

      const servicosEcaracteristicas = await conectado.discoverAllServicesAndCharacteristics();
      setDispositivoConectado(servicosEcaracteristicas);
      setStatusConexao("Conectado");

      // Escuta os pacotes do ESP32 e repassa apenas a string decodificada para o contexto do tanque
      servicosEcaracteristicas.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_TX,
        (error, char) => {
          if (error) {
            console.error("Erro no monitoramento TX:", error);
            return;
          }
          if (char?.value) {
            const dadosRecebidos = atob(char.value);
            console.log("BLE Transmissão bruta recebida:", dadosRecebidos);

            // Injeção direta no cérebro da aplicação (TankContext)
            ProcessamentoDeDados(dadosRecebidos);
          }
        }
      );

    } catch (e) {
      console.error("Erro na conexão:", e);
      setStatusConexao("Falha na conexão");
      setDispositivoConectado(null);
    }
  };

  const iniciarEscaneamento = () => {
    if (estaEscaneando) return;

    setEstaEscaneando(true);
    setStatusConexao("Escaneando...");

    bleManager?.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Erro ao escanear:", error);
        setEstaEscaneando(false);

        // Tratamento de erro específico do Bluetooth desligado (código comum no react-native-ble-plx)
        if (error.errorCode === BleErrorCode.BluetoothPoweredOff) {
          setStatusConexao("Bluetooth desligado");
        }
        else if (error.errorCode == BleErrorCode.BluetoothUnauthorized) {
          setStatusConexao("Erro de Permissão")
        }
        else {
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
  };

  const enviarComandoPino = async (valor: string) => {
    if (!dispositivoConectado) {
      console.warn("Nenhum dispositivo conectado para enviar comando.");
      return;
    }

    const comandoBase64 = btoa(valor);

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
  };

  return {
    dispositivoConectado,
    estaEscaneando,
    statusConexao,
    iniciarEscaneamento,
    enviarComandoPino,
  };
}
