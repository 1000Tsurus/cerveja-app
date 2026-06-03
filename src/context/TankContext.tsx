import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type TankContextType = {
  currentLiters: number;
  maxLiters: number;
  percentage: number;
  LitersConsumed: number;
  serveBeer: (ml: number) => void;
  ProcessamentoDeDados: (dado: string) => void;
};

const TankContext = createContext<TankContextType>(
  {} as TankContextType
);

export function TankProvider({
  children,
}: {
  children: ReactNode;
}) {
  const maxLiters = 20;

  const [currentLiters, setCurrentLiters] =
    useState(maxLiters);

  const percentage =
    (currentLiters / maxLiters) * 100;

  const LitersConsumed = maxLiters - currentLiters;
  function ProcessamentoDeDados(dado: string) {
    if (dado.startsWith("CONSUMO:")) {
      const ml = parseInt(dado.split(":")[1], 10);
      if (!isNaN(ml)) {
        serveBeer(ml); // Usa estritamente a sua função original
      }
    }
  }
  function serveBeer(ml: number) {
    const litersToRemove = ml / 1000;

    setCurrentLiters((prev) => {
      const updated = prev - litersToRemove;

      return updated < 0 ? 0 : updated;
    });
  }



  return (
    <TankContext.Provider
      value={{
        currentLiters,
        maxLiters,
        percentage,
        serveBeer,
        ProcessamentoDeDados,
        LitersConsumed,
      }}
    >
      {children}
    </TankContext.Provider>
  );
}

export function useTank() {
  return useContext(TankContext);
}
