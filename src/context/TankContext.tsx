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
  serveBeer: (ml: number) => void;
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
      }}
    >
      {children}
    </TankContext.Provider>
  );
}

export function useTank() {
  return useContext(TankContext);
}