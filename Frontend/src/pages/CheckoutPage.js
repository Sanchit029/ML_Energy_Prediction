import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const CheckoutTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  flex: ${props => props.flex || 1};
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const Radio = styled.input`
  margin-right: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  cursor: pointer;
`;

const PaymentMethodOption = styled.div`
  border: 1px solid ${props => props.selected ? '#3f51b5' : '#ddd'};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? '#f0f4ff' : 'white'};
  
  &:hover {
    border-color: #3f51b5;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
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

const OrderItemsList = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemInfo = styled.div`
  flex-grow: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const ItemPrice = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemQuantity = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const PlaceOrderButton = styled.button`
  display: block;
  width: 100%;
  background: #f50057;
  color: white;
  text-align: center;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #c51162;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const BackToCartLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #3f51b5;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const OrderConfirmation = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #4caf50;
  }
  
  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
`;

const OrderNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  background: #3f51b5;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  
  &:hover {
    background: #303f9f;
  }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Shipping info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  // Payment info state
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Calculate order summary
  const shippingCost = totalPrice > 50 ? 0 : 10;
  const tax = totalPrice * 0.07; // 7% tax
  const orderTotal = totalPrice + shippingCost + tax;
  
  // Redirect to products if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/products');
    }
  }, [cart, navigate, orderPlaced]);
  
  const validateForm = () => {
    const errors = {};
    
    // Validate shipping info
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email is invalid';
    if (!phone) errors.phone = 'Phone is required';
    if (!address) errors.address = 'Address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!zipCode) errors.zipCode = 'ZIP code is required';
    
    // Validate payment info
    if (paymentMethod === 'credit_card') {
      if (!cardName) errors.cardName = 'Name on card is required';
      if (!cardNumber) errors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) 
        errors.cardNumber = 'Card number must be 16 digits';
      if (!expiryDate) errors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(expiryDate))
        errors.expiryDate = 'Expiry date must be MM/YY format';
      if (!cvv) errors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(cvv))
        errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate order processing
      setTimeout(() => {
        // Generate random order number
        const newOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        setOrderNumber(newOrderNumber);
        setOrderPlaced(true);
        clearCart();
      }, 1500);
    }
  };
  
  if (orderPlaced) {
    return (
      <CheckoutContainer>
        <OrderConfirmation>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been received and is being processed.</p>
          <OrderNumber>Order Number: {orderNumber}</OrderNumber>
          <p>A confirmation email has been sent to {email}.</p>
          <ContinueShoppingButton to="/">Back to Home</ContinueShoppingButton>
        </OrderConfirmation>
      </CheckoutContainer>
    );
  }
  
  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      
      <CheckoutContent>
        <CheckoutForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Shipping Information</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {formErrors.firstName && (
                  <ErrorMessage>{formErrors.firstName}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {formErrors.lastName && (
                  <ErrorMessage>{formErrors.lastName}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && (
                  <ErrorMessage>{formErrors.email}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {formErrors.phone && (
                  <ErrorMessage>{formErrors.phone}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {formErrors.address && (
                <ErrorMessage>{formErrors.address}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {formErrors.city && (
                  <ErrorMessage>{formErrors.city}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {formErrors.state && (
                  <ErrorMessage>{formErrors.state}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                {formErrors.zipCode && (
                  <ErrorMessage>{formErrors.zipCode}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </Select>
            </FormGroup>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Payment Method</SectionTitle>
            
            <PaymentMethodOption
              selected={paymentMethod === 'credit_card'}
              onClick={() => setPaymentMethod('credit_card')}
            >
              <RadioLabel>
                <Radio
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                />
                Credit / Debit Card
              </RadioLabel>
              
              {paymentMethod === 'credit_card' && (
                <>
                  <FormGroup>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      type="text"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                    {formErrors.cardName && (
                      <ErrorMessage>{formErrors.cardName}</ErrorMessage>
                    )}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                    {formErrors.cardNumber && (
                      <ErrorMessage>{formErrors.cardNumber}</ErrorMessage>
                    )}
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                      />
                      {formErrors.expiryDate && (
                        <ErrorMessage>{formErrors.expiryDate}</ErrorMessage>
                      )}
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="XXX"
                      />
                      {formErrors.cvv && (
                        <ErrorMessage>{formErrors.cvv}</ErrorMessage>
                      )}
                    </FormGroup>
                  </FormRow>
                </>
              )}
            </PaymentMethodOption>
            
            <PaymentMethodOption
              selected={paymentMethod === 'paypal'}
              onClick={() => setPaymentMethod('paypal')}
            >
              <RadioLabel>
                <Radio
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                PayPal
              </RadioLabel>
            </PaymentMethodOption>
          </FormSection>
          
          <PlaceOrderButton type="submit">Place Order</PlaceOrderButton>
          <BackToCartLink to="/cart">Back to Cart</BackToCartLink>
        </CheckoutForm>
        
        <OrderSummary>
          <SectionTitle>Order Summary</SectionTitle>
          
          <OrderItemsList>
            {cart.map(item => (
              <OrderItem key={item.id}>
                <ItemImage>
                  <img src={item.image} alt={item.name} />
                </ItemImage>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                </ItemInfo>
              </OrderItem>
            ))}
          </OrderItemsList>
          
          <SummaryDivider />
          
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
        </OrderSummary>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default CheckoutPage; 