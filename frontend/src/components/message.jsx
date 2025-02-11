import React from 'react'

const Message = ({variant, children}) => {
    const getVarientClass=()=>{
        switch(variant){
            case 'success':
                return'success';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            default:
                return '';
        }
    }
  return <div className={`p-4 rounded${getVarientClass()}`}>{children}
    </div>
  
};

export default Message