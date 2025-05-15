import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  
  span {
    color: #3f51b5;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const FiltersContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FiltersTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryButton = styled.button`
  background: ${props => props.selected ? '#3f51b5' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.selected ? '#303f9f' : '#e0e0e0'};
  }
`;

const PriceFilter = styled.div`
  display: flex;
  gap: 1rem;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const AvailabilityFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Checkbox = styled.input`
  transform: scale(1.2);
`;

const NoProductsMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem 0;
  color: #666;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const ResetButton = styled.button`
  background: #f50057;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #c51162;
  }
`;

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Filter products when filters change
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by min price
    if (minPrice !== '') {
      result = result.filter(product => product.price >= parseFloat(minPrice));
    }
    
    // Filter by max price
    if (maxPrice !== '') {
      result = result.filter(product => product.price <= parseFloat(maxPrice));
    }
    
    // Filter by availability
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, minPrice, maxPrice, inStockOnly]);
  
  // Update category when URL parameter changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };
  
  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };
  
  const handleAvailabilityChange = (e) => {
    setInStockOnly(e.target.checked);
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  };
  
  return (
    <ProductsContainer>
      <PageTitle>
        {selectedCategory === 'all' 
          ? 'All Products' 
          : `${selectedCategory} Products`
        }
      </PageTitle>
      
      <FiltersContainer>
        <FiltersTitle>Filter Products</FiltersTitle>
        
        <FilterGroup>
          <FilterLabel>Category</FilterLabel>
          <CategoryFilters>
            {categories.map(category => (
              <CategoryButton 
                key={category}
                selected={selectedCategory === category}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </CategoryButton>
            ))}
          </CategoryFilters>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Price Range</FilterLabel>
          <PriceFilter>
            <PriceInput
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <PriceInput
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </PriceFilter>
        </FilterGroup>
        
        <FilterGroup>
          <AvailabilityFilter>
            <Checkbox
              type="checkbox"
              id="inStock"
              checked={inStockOnly}
              onChange={handleAvailabilityChange}
            />
            <label htmlFor="inStock">In Stock Only</label>
          </AvailabilityFilter>
        </FilterGroup>
        
        <FilterActions>
          <ResetButton onClick={resetFilters}>Reset Filters</ResetButton>
        </FilterActions>
      </FiltersContainer>
      
      {filteredProducts.length > 0 ? (
        <ProductsGrid>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductsGrid>
      ) : (
        <NoProductsMessage>
          No products match your selected filters. Try adjusting your criteria.
        </NoProductsMessage>
      )}
    </ProductsContainer>
  );
};

export default ProductsPage; 