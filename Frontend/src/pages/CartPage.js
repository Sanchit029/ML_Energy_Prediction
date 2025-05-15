import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const CartTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const CartItemsList = styled.div`
  margin-bottom: 1.5rem;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #666;
  }
`;

const ContinueShopping = styled(Link)`
  display: inline-block;
  background: #3f51b5;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background: #303f9f;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: ${props => props.total ? '1.2rem' : '1rem'};
  font-weight: ${props => props.total ? '700' : '400'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: #eee;
  margin: 1rem 0;
`;

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  background: #f50057;
  color: white;
  text-align: center;
  padding: 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #c51162;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ClearCartButton = styled.button`
  background: none;
  border: 1px solid #f44336;
  color: #f44336;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f44336;
    color: white;
  }
`;

const ContinueShoppingButton = styled(Link)`
  background: none;
  border: 1px solid #3f51b5;
  color: #3f51b5;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3f51b5;
    color: white;
  }
`;

const CartPage = () => {
  const { cart, totalItems, totalPrice, clearCart } = useContext(CartContext);
  
  // Assume shipping is free for orders above $50
  const shippingCost = totalPrice > 50 ? 0 : 10;
  const tax = totalPrice * 0.07; // 7% tax
  const orderTotal = totalPrice + shippingCost + tax;
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  // If cart is empty, show message and link to continue shopping
  if (cart.length === 0) {
    return (
      <CartContainer>
        <CartTitle>Your Cart</CartTitle>
        <EmptyCartMessage>
          <p>Your cart is empty</p>
          <ContinueShopping to="/products">Continue Shopping</ContinueShopping>
        </EmptyCartMessage>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer>
      <CartTitle>Your Cart ({totalItems} items)</CartTitle>
      
      <CartContent>
        <CartItemsSection>
          <CartItemsList>
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </CartItemsList>
          
          <ActionButtons>
            <ClearCartButton onClick={handleClearCart}>
              Clear Cart
            </ClearCartButton>
            <ContinueShoppingButton to="/products">
              Continue Shopping
            </ContinueShoppingButton>
          </ActionButtons>
        </CartItemsSection>
        
        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
            </span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </SummaryRow>
          
          <SummaryDivider />
          
          <SummaryRow total>
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </SummaryRow>
          
          <CheckoutButton to="/checkout">
            Proceed to Checkout
          </CheckoutButton>
        </OrderSummary>
      </CartContent>
    </CartContainer>
  );
};

export default CartPage; 