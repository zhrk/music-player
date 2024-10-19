import { Dispatch, ReactNode, SetStateAction, createContext, useContext } from 'react';
import { Element, Playing, Src } from './types';

interface Context {
  element: Element;
  playing: Playing;
  src: Src;
  setSrc: Dispatch<SetStateAction<Src>>;
}

const PlayerContext = createContext<Context | undefined>(undefined);

interface Props extends Context {
  children: ReactNode;
}

const PlayerProvider = (props: Props) => {
  const { children, ...rest } = props;

  return <PlayerContext.Provider value={rest}>{children}</PlayerContext.Provider>;
};

const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }

  return context;
};

export { usePlayerContext, PlayerProvider };
