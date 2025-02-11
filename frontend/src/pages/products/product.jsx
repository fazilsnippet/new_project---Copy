import React from 'react'

const product = ({product}) => {
  return (
    <div>
    <img src={product.image}
     alt='profuct.name'/>
    </div>
  )
}

export default product