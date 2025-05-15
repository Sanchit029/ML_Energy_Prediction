import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')
    no-repeat center center/cover;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ShopButton = styled(Link)`
  background: #f50057;
  color: white;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease;
  
  &:hover {
    background: #c51162;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: #3f51b5;
  }
`;

const Section = styled.section`
  padding: 4rem 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const CategorySection = styled.section`
  background: #f5f5f5;
  padding: 4rem 20px;
`;

const CategoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  &:hover::before {
    background: rgba(0, 0, 0, 0.3);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const CategoryName = styled.h3`
  position: relative;
  z-index: 2;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const PromoBanner = styled.div`
  background: #3f51b5;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PromoContent = styled.div`
  flex: 1;
`;

const PromoTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const PromoDescription = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  max-width: 600px;
`;

const HomePage = () => {
  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);
  
  return (
    <div>
      <HeroSection>
        <HeroTitle>Welcome to ShopEasy</HeroTitle>
        <HeroSubtitle>
          Discover the best products at amazing prices. Quality, style, and comfort all in one place.
        </HeroSubtitle>
        <ShopButton to="/products">Shop Now</ShopButton>
      </HeroSection>
      
      <CategorySection>
        <CategoryContainer>
          <SectionTitle>Shop by Category</SectionTitle>
          <CategoryGrid>
            <CategoryCard to="/products?category=electronics">
              <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Electronics" />
              <CategoryName>Electronics</CategoryName>
            </CategoryCard>
            
            <CategoryCard to="/products?category=fashion">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Fashion" />
              <CategoryName>Fashion</CategoryName>
            </CategoryCard>
            
            <CategoryCard to="/products?category=home">
              <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Home & Living" />
              <CategoryName>Home & Living</CategoryName>
            </CategoryCard>
          </CategoryGrid>
        </CategoryContainer>
      </CategorySection>
      
      <Section>
        <SectionTitle>Featured Products</SectionTitle>
        <ProductGrid>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
        
        <PromoBanner>
          <PromoContent>
            <PromoTitle>Special Summer Sale</PromoTitle>
            <PromoDescription>
              Get up to 40% off on selected items. Limited time offer.
            </PromoDescription>
            <ShopButton to="/products">Shop the Sale</ShopButton>
          </PromoContent>
        </PromoBanner>
      </Section>
    </div>
  );
};

export default HomePage; 