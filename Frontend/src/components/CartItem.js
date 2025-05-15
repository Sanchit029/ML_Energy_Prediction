import React, { useContext } from 'react';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';

const CartItemContainer = styled.div`
  display: flex;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  margin-right: 1.5rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ItemPrice = styled.p`
  font-weight: 700;
  color: #3f51b5;
  margin-bottom: 0.5rem;
`;

const ItemQuantityControls = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 30px;
  text-align: center;
  margin: 0 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #f50057;
  margin-left: 1rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Subtotal = styled.div`
  width: 100px;
  text-align: right;
  font-weight: 700;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    text-align: left;
  }
`;

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateQuantity(item.id, value);
    }
  };
  
  const incrementQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  return (
    <CartItemContainer>
      <ItemImage>
        <img src={item.image} alt={item.name} />
      </ItemImage>
      
      <ItemDetails>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
        
        <ItemQuantityControls>
          <QuantityButton onClick={decrementQuantity}>-</QuantityButton>
          <QuantityInput
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
          />
          <QuantityButton onClick={incrementQuantity}>+</QuantityButton>
          <RemoveButton onClick={handleRemove}>Remove</RemoveButton>
        </ItemQuantityControls>
      </ItemDetails>
      
      <Subtotal>
        ${(item.price * item.quantity).toFixed(2)}
      </Subtotal>
    </CartItemContainer>
  );
};

export default CartItem;