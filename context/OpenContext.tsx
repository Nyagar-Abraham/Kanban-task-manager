'use client';

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	Dispatch,
	SetStateAction,
} from 'react';

// Define the context value type
interface OpenContextType {
	sideBarOpen: boolean;
	setOpenSideBar: Dispatch<SetStateAction<boolean>>;
}

// Create the context with an undefined initial value
const OpenContext = createContext<OpenContextType | undefined>(undefined);

interface ProviderProps {
	children: ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
	const [sideBarOpen, setOpenSideBar] = useState(true);

	return (
		<OpenContext.Provider value={{ sideBarOpen, setOpenSideBar }}>
			{children}
		</OpenContext.Provider>
	);
};

export function useOpen() {
	const context = useContext(OpenContext);
	if (context === undefined) {
		throw new Error('useOpen must be used within a Provider');
	}
	return context;
}
