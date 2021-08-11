import React, {
  createContext,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";

interface StateGlobalProps {
  [key: string]: any;
}

interface StateGlobalContextData {
  stateGlobal: StateGlobalProps;
  setStateGlobal: Dispatch<SetStateAction<StateGlobalProps>>;
}

const StateGlobalProvider = createContext<StateGlobalContextData>(
  {} as StateGlobalContextData
);

export const StateProvider: React.FC = ({ children }) => {
  const [globalState, setGlobalState] = useState({});

  return (
    <StateGlobalProvider.Provider value={{ stateGlobal: globalState, setStateGlobal: setGlobalState }}>
      {children}
    </StateGlobalProvider.Provider>
  );
};

export function useGlobalState(): StateGlobalContextData {
  const context = useContext(StateGlobalProvider);

  return context;
}
