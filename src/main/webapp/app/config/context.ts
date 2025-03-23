// FunctionContext.js
import React from 'react';
interface ContextProps {
  handleOpenModalAddItemOrg: (item: any, type: number) => void;
  handleOpenModalUpdateItemOrg: (item: any) => void;
  handleCloseModalItemOrg?: () => void;
  handleOpenModalConfirmDeleteItem?: (id: string | number) => void;
}

const Context = React.createContext<ContextProps | null>(null);

export default Context;
