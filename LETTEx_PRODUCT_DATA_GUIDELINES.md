# Lettex Marketplace Product Data Guidelines

## Overview
This document outlines the product data structure and content guidelines for the Lettex Marketplace, focusing on groceries, dairy products, refined oils, and local essentials.

## Product Categories

### 1. Grocery Products
**Tagline**: "Daily essentials, fresh and local"
**Description**: Explore fresh staples, grains, pulses, and spices — handpicked for your kitchen.

**Sample Products**:
- Basmati Rice (5kg) — "Premium long-grain rice with rich aroma and fluffiness."
- Toor Dal (1kg) — "High-protein pulses for nutritious everyday meals."
- Wheat Flour (10kg) — "Freshly milled for soft chapatis every time."

### 2. Refined Oil
**Tagline**: "Pure taste, pure health"
**Description**: Healthy, refined oils for cooking, frying, and everyday use — sunflower, mustard, and groundnut oils.

**Sample Products**:
- Lettex Refined Sunflower Oil (1L) — "Light and healthy oil ideal for frying and cooking."
- Lettex Mustard Oil (1L) — "Rich aroma and pure quality, perfect for traditional recipes."
- Groundnut Oil (1L) — "Naturally refined for purity and flavor."

### 3. Milk Products
**Tagline**: "Freshness you can trust"
**Description**: Fresh milk, curd, butter, paneer, and ghee — sourced directly from local dairies.

**Sample Products**:
- Fresh Cow Milk (1L) — "Farm-fresh milk with full cream richness."
- Paneer (200g) — "Soft, pure paneer made from fresh milk."
- Desi Ghee (500ml) — "Golden, aromatic, and 100% pure ghee."

### 4. Own Products
**Tagline**: "Made by Lettex, made for you"
**Description**: Exclusive Lettex-branded items — quality you can rely on, crafted with care.

**Sample Products**:
- Lettex Atta (5kg) — "Our in-house premium quality flour for everyday use."
- Lettex Tea Powder (500g) — "Strong and refreshing blend, crafted for your mornings."
- Lettex Detergent Powder (2kg) — "Tough on stains, gentle on clothes — your home's trusted partner."

### 5. Beverages
**Tagline**: "Stay refreshed, stay energetic"
**Description**: Juices, tea, coffee, and refreshing drinks from trusted brands.

**Sample Products**:
- Mixed Fruit Juice (1L) — "Refreshing blend of seasonal fruits for daily hydration."
- Premium Tea Leaves (250g) — "Finely blended tea leaves for a perfect morning cup."
- Instant Coffee Powder (100g) — "Rich, aromatic coffee for your daily energy boost."

### 6. Snacks & Biscuits
**Tagline**: "Crisp, tasty, anytime bites"
**Description**: Delicious snacks, chips, and biscuits perfect for every craving.

**Sample Products**:
- Salted Potato Chips (50g) — "Crispy, golden chips with just the right amount of salt."
- Digestive Biscuits (200g) — "Wholesome biscuits perfect for tea time or snacking."
- Masala Peanuts (100g) — "Spicy, crunchy peanuts for that perfect movie night snack."

### 7. Household Essentials
**Tagline**: "Smart living made easy"
**Description**: Detergents, cleaners, and kitchen basics for your daily needs.

**Sample Products**:
- All-Purpose Cleaner (500ml) — "Effective cleaning solution for all surfaces in your home."
- Washing Powder (1kg) — "Powerful cleaning formula that removes tough stains easily."
- Kitchen Surface Cleaner (750ml) — "Gentle yet effective cleaner for your kitchen countertops."

## Product Data Structure

### Required Fields
- **id**: Unique product identifier
- **slug**: URL-friendly product name
- **title**: Bilingual product name (en/hi)
- **description**: Detailed product description (en/hi)
- **price**: Current selling price
- **originalPrice**: Original price (for discount calculation)
- **stock**: Available quantity
- **rating**: Product rating (0-5)
- **reviewCount**: Number of reviews
- **categoryId**: Associated category ID
- **images**: Array of product image URLs
- **featured**: Boolean for featured products
- **bestSeller**: Boolean for best-selling products
- **trending**: Boolean for trending products
- **newArrival**: Boolean for new arrivals

### Optional Fields
- **variants**: Size/color options
- **material**: Product material composition
- **dimensions**: Product dimensions/weight
- **tags**: Searchable tags
- **artisanId**: Associated seller (if applicable)

## Content Guidelines

### Product Titles
- Clear, descriptive names
- Include size/quantity when relevant
- Bilingual support (English/Hindi)

### Product Descriptions
- Focus on benefits and features
- Use natural, conversational language
- Highlight quality and freshness
- Include usage instructions when relevant

### Pricing Strategy
- Competitive pricing with transparent costs
- Clear discount display when applicable
- No hidden fees or charges

### Image Requirements
- High-quality product photos
- Consistent styling and backgrounds
- Multiple angles when beneficial
- Proper file naming conventions

## SEO Best Practices

### Product Titles
- Include primary keywords
- Keep under 60 characters
- Brand name at the beginning when possible

### Meta Descriptions
- Compelling call-to-action
- Include key product benefits
- Keep under 160 characters

### URL Structure
- Use descriptive slugs
- Include primary keyword
- Avoid special characters and spaces

## Quality Assurance

### Content Review Process
1. Verify accuracy of product information
2. Check bilingual translations for consistency
3. Validate pricing and discount calculations
4. Confirm image quality and relevance
5. Test all functionality in both languages

### Regular Updates
- Monitor stock levels daily
- Update prices as needed
- Refresh featured products weekly
- Add new arrivals regularly
- Remove discontinued items promptly

This guideline ensures consistent, high-quality product data that aligns with Lettex Marketplace's mission to deliver daily essentials with trust, freshness, and local quality.