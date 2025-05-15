import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${Card}:hover img {
    transform: scale(1.05);
  }
`;

const OutOfStock = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const Price = styled.p`
  font-weight: 700;
  font-size: 1.2rem;
  color: #3f51b5;
  margin-bottom: 0.5rem;
`;

const Category = styled.span`
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 1rem;
  display: inline-block;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  span {
    margin-left: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const CardActions = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background: ${props => props.disabled ? '#ccc' : '#3f51b5'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#303f9f'};
  }
`;

const ViewLink = styled(Link)`
  color: #3f51b5;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <Card>
      <ImageContainer>
        <img src={product.image} alt={product.name} />
        {!product.inStock && <OutOfStock>Out of Stock</OutOfStock>}
      </ImageContainer>
      <CardContent>
        <Category>{product.category}</Category>
        <Title>{product.name}</Title>
        <Price>${product.price.toFixed(2)}</Price>
        <Rating>
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
          <span>{product.rating}</span>
        </Rating>
        <CardActions>
          <Button 
            onClick={handleAddToCart} 
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <ViewLink to={`/product/${product.id}`}>View Details</ViewLink>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 