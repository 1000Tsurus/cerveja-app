import { createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";

type BluetoothClassicContextData = {
  bluetoothAvailable: boolean;
  bluetoothEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  lastMessage: string | null;
  checkBluetooth: () => Promise<void>;
  requestEnableBluetooth: () => Promise<void>;
  loadPairedDevices: () => Promise<void>;
  scanDevices: () => Promise<void>;
  connectToDevice: (device: BluetoothDevice) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
};

const BluetoothClassicContext =
  createContext<BluetoothClassicContextData | null>(null);

function getDeviceKey(device: BluetoothDevice) {
  return device.address ?? device.id;
}

async function requestBluetoothPermissions() {
  if (Platform.OS !== "android") {
    return true;
  }

  const androidVersion = Number(Platform.Version);

  if (androidVersion >= 31) {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    return (
      results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }

  const locationPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return locationPermission === PermissionsAndroid.RESULTS.GRANTED;
}

export function BluetoothClassicProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] =
    useState<BluetoothDevice | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const readSubscription = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    checkBluetooth();
    loadPairedDevices();

    const stateSubscription = RNBluetoothClassic.onStateChanged((event) => {
      setBluetoothEnabled(event.enabled);
    });

    const disconnectedSubscription = RNBluetoothClassic.onDeviceDisconnected(() => {
      setConnectedDevice(null);
    });

    return () => {
      stateSubscription.remove();
      disconnectedSubscription.remove();
      readSubscription.current?.remove();
      RNBluetoothClassic.cancelDiscovery().catch(() => {});
    };
  }, []);

  async function checkBluetooth() {
    try {
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      setBluetoothAvailable(available);
      setBluetoothEnabled(enabled);
    } catch {
      setBluetoothAvailable(false);
      setBluetoothEnabled(false);
    }
  }

  async function requestEnableBluetooth() {
    try {
      const hasPermission = await requestBluetoothPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão necessária",
          "Permita o uso do Bluetooth para conectar ao ESP32."
        );
        return;
      }

      const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
      setBluetoothEnabled(enabled);

      if (!enabled) {
        Alert.alert(
          "Bluetooth desligado",
          "Ative o Bluetooth para conectar ao ESP32."
        );
      }
    } catch {
      Alert.alert(
        "Erro no Bluetooth",
        "Não foi possível solicitar ativação do Bluetooth."
      );
    }
  }

  async function loadPairedDevices() {
    try {
      const hasPermission = await requestBluetoothPermissions();

      if (!hasPermission) {
        return;
      }

      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      if (!enabled) {
        setBluetoothEnabled(false);
        return;
      }

      const paired = await RNBluetoothClassic.getBondedDevices();
      setDevices(paired);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível carregar dispositivos pareados."
      );
    }
  }

  async function scanDevices() {
    try {
      const hasPermission = await requestBluetoothPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão negada",
          "Não foi possível buscar dispositivos Bluetooth."
        );
        return;
      }

      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      if (!enabled) {
        setBluetoothEnabled(false);
        Alert.alert(
          "Bluetooth desligado",
          "Ative o Bluetooth antes de buscar o ESP32."
        );
        return;
      }

      setIsScanning(true);

      const paired = await RNBluetoothClassic.getBondedDevices();
      const discovered = await RNBluetoothClassic.startDiscovery();

      const merged = [...paired, ...discovered].filter(
        (device, index, array) =>
          index ===
          array.findIndex(
            (item) => getDeviceKey(item) === getDeviceKey(device)
          )
      );

      const espDevices = merged.filter((device) => {
        const name = device.name?.toLowerCase() ?? "";

        return (
          name.includes("esp") ||
          name.includes("esp32") ||
          name.includes("cerveja") ||
          name.includes("tanque")
        );
      });

      setDevices(espDevices.length > 0 ? espDevices : merged);
    } catch (error) {
      Alert.alert(
        "Erro ao buscar",
        "Não foi possível buscar dispositivos Bluetooth."
      );
    } finally {
      setIsScanning(false);
      RNBluetoothClassic.cancelDiscovery().catch(() => {});
    }
  }

  async function connectToDevice(device: BluetoothDevice) {
    try {
      const hasPermission = await requestBluetoothPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão necessária",
          "Permita o uso do Bluetooth para conectar ao ESP32."
        );
        return;
      }

      const alreadyConnected = await device.isConnected();

      if (!alreadyConnected) {
        await device.connect({
          CONNECTOR_TYPE: "rfcomm",
          CONNECTION_TYPE: "delimited",
          DELIMITER: "\n",
          DEVICE_CHARSET: "utf-8",
        });
      }

      readSubscription.current?.remove();

      readSubscription.current = device.onDataReceived((event) => {
        setLastMessage(String(event.data));
      });

      setConnectedDevice(device);

      Alert.alert(
        "ESP conectado",
        `Conectado em ${device.name ?? device.address ?? "dispositivo"}`
      );
    } catch {
      Alert.alert(
        "Erro ao conectar",
        "Não foi possível conectar ao ESP32. Confira se ele está pareado no Bluetooth do celular."
      );
    }
  }

  async function disconnectDevice() {
    try {
      if (!connectedDevice) {
        return;
      }

      readSubscription.current?.remove();
      readSubscription.current = null;

      await connectedDevice.disconnect();
      setConnectedDevice(null);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível desconectar o dispositivo."
      );
    }
  }

  async function sendCommand(command: string) {
    if (!connectedDevice) {
      Alert.alert(
        "ESP não conectado",
        "Conecte o ESP32 na aba Config antes de enviar comandos."
      );
      return;
    }

    try {
      const isConnected = await connectedDevice.isConnected();

      if (!isConnected) {
        Alert.alert(
          "Conexão perdida",
          "O ESP32 não está mais conectado."
        );
        setConnectedDevice(null);
        return;
      }

      await connectedDevice.write(`${command}\n`, "utf-8");
    } catch {
      Alert.alert(
        "Erro ao enviar",
        "Não foi possível enviar o comando para o ESP32."
      );
    }
  }

  return (
    <BluetoothClassicContext.Provider
      value={{
        bluetoothAvailable,
        bluetoothEnabled,
        isScanning,
        devices,
        connectedDevice,
        lastMessage,
        checkBluetooth,
        requestEnableBluetooth,
        loadPairedDevices,
        scanDevices,
        connectToDevice,
        disconnectDevice,
        sendCommand,
      }}
    >
      {children}
    </BluetoothClassicContext.Provider>
  );
}

export function useBluetoothClassic() {
  const context = useContext(BluetoothClassicContext);

  if (!context) {
    throw new Error(
      "useBluetoothClassic precisa estar dentro de BluetoothClassicProvider"
    );
  }

  return context;
}