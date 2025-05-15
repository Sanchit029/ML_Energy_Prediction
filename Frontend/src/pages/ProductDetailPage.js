import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import products from '../data/products';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const Breadcrumbs = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color: #3f51b5;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
    color: #666;
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: #3f51b5;
  margin-bottom: 1rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  span {
    margin-left: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const ProductCategory = styled.div`
  background: #f5f5f5;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
`;

const ProductDescription = styled.p`
  margin-bottom: 2rem;
  line-height: 1.7;
  color: #555;
`;

const FeaturesTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FeaturesList = styled.ul`
  margin-bottom: 2rem;
  margin-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 40px;
  height: 40px;
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
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  text-align: center;
  margin: 0 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const InStockLabel = styled.span`
  display: inline-block;
  background: ${props => props.inStock ? '#4caf50' : '#f44336'};
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: #3f51b5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #303f9f;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const BuyNowButton = styled.button`
  flex: 1;
  background: #f50057;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
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

const RelatedProductsSection = styled.div`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 10px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: #3f51b5;
  }
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const RelatedProductCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RelatedProductImage = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RelatedProductInfo = styled.div`
  padding: 1rem;
`;

const RelatedProductName = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const RelatedProductPrice = styled.p`
  font-weight: 700;
  color: #3f51b5;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #f44336;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  a {
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
  }
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  
  // Find product by id
  const product = products.find(p => p.id === parseInt(id));
  
  // Get related products (same category, excluding current product)
  const relatedProducts = product 
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };
  
  // Return error message if product not found
  if (!product) {
    return (
      <ProductContainer>
        <ErrorMessage>
          <h2>Product Not Found</h2>
          <p>Sorry, the product you are looking for does not exist.</p>
          <Link to="/products">Back to Products</Link>
        </ErrorMessage>
      </ProductContainer>
    );
  }
  
  return (
    <ProductContainer>
      <Breadcrumbs>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        {product.name}
      </Breadcrumbs>
      
      <ProductContent>
        <ProductImageContainer>
          <img src={product.image} alt={product.name} />
        </ProductImageContainer>
        
        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          
          <ProductRating>
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            <span>{product.rating} rating</span>
          </ProductRating>
          
          <ProductCategory>{product.category}</ProductCategory>
          
          <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
          
          <InStockLabel inStock={product.inStock}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </InStockLabel>
          
          <ProductDescription>{product.description}</ProductDescription>
          
          <FeaturesTitle>Key Features</FeaturesTitle>
          <FeaturesList>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </FeaturesList>
          
          <QuantitySelector>
            <QuantityButton 
              onClick={decrementQuantity} 
              disabled={!product.inStock}
            >
              -
            </QuantityButton>
            <QuantityInput
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={!product.inStock}
            />
            <QuantityButton 
              onClick={incrementQuantity}
              disabled={!product.inStock}
            >
              +
            </QuantityButton>
          </QuantitySelector>
          
          <ActionButtons>
            <AddToCartButton 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              Add to Cart
            </AddToCartButton>
            <BuyNowButton 
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </BuyNowButton>
          </ActionButtons>
        </ProductInfo>
      </ProductContent>
      
      {relatedProducts.length > 0 && (
        <RelatedProductsSection>
          <SectionTitle>Related Products</SectionTitle>
          <RelatedProductsGrid>
            {relatedProducts.map(relatedProduct => (
              <RelatedProductCard 
                key={relatedProduct.id} 
                to={`/product/${relatedProduct.id}`}
              >
                <RelatedProductImage>
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                </RelatedProductImage>
                <RelatedProductInfo>
                  <RelatedProductName>{relatedProduct.name}</RelatedProductName>
                  <RelatedProductPrice>${relatedProduct.price.toFixed(2)}</RelatedProductPrice>
                </RelatedProductInfo>
              </RelatedProductCard>
            ))}
          </RelatedProductsGrid>
        </RelatedProductsSection>
      )}
    </ProductContainer>
  );
};

export default ProductDetailPage; 