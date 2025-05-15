import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 3rem 0 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const FooterLink = styled(Link)`
  color: #ccc;
  margin-bottom: 0.8rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #f50057;
  }
`;

const FooterText = styled.p`
  color: #ccc;
  margin-bottom: 0.8rem;
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 20px 0;
  border-top: 1px solid #555;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: #fff;
  font-size: 1.5rem;
  margin-right: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #f50057;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterTitle>ShopEasy</FooterTitle>
          <FooterText>
            Your one-stop destination for quality products at affordable prices.
            Shop with ease and confidence.
          </FooterText>
          <SocialLinks>
            <SocialIcon href="#" aria-label="Facebook">📘</SocialIcon>
            <SocialIcon href="#" aria-label="Twitter">🐦</SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">📸</SocialIcon>
          </SocialLinks>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Shop</FooterTitle>
          <FooterLink to="/products?category=electronics">Electronics</FooterLink>
          <FooterLink to="/products?category=fashion">Fashion</FooterLink>
          <FooterLink to="/products?category=home">Home & Living</FooterLink>
          <FooterLink to="/products">All Products</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Customer Service</FooterTitle>
          <FooterLink to="#">Contact Us</FooterLink>
          <FooterLink to="#">FAQ</FooterLink>
          <FooterLink to="#">Shipping & Returns</FooterLink>
          <FooterLink to="#">Terms & Conditions</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Contact Info</FooterTitle>
          <FooterText>📍 123 Commerce St, Shopville</FooterText>
          <FooterText>📞 (555) 123-4567</FooterText>
          <FooterText>✉️ support@shopeasy.com</FooterText>
        </FooterColumn>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} ShopEasy. All Rights Reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 