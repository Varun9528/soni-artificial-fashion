# Image Conversion Script
# This script creates placeholder JPG images to replace SVG placeholders

import os
from PIL import Image, ImageDraw, ImageFont
import colorsys

def create_image_placeholder(filepath, width, height, text, bg_color=(200, 200, 200)):
    """Create a placeholder JPG image with text."""
    image = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(image)
    
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    draw.text((x, y), text, fill=(50, 50, 50), font=font)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    image.save(filepath, 'JPEG', quality=85)
    print(f"Created: {filepath}")

# Create hero images
hero_colors = [(255, 182, 83), (255, 138, 138), (173, 216, 255), (144, 238, 144), (255, 192, 203)]
hero_texts = [
    "Handmade Bamboo Crafts",
    "Traditional Gond Paintings", 
    "Authentic Tribal Jewelry",
    "Eco-Friendly Cane Products",
    "Handloom Sarees"
]

for i in range(1, 6):
    create_image_placeholder(
        f"public/images/hero/hero{i}.jpg",
        800, 400,
        hero_texts[i-1],
        hero_colors[i-1]
    )

# Create category images
categories = [
    ("tribal-shirts", "Tribal Shirts", (255, 200, 150)),
    ("jewelry", "Jewelry", (255, 215, 0)),
    ("handloom-textiles", "Handloom Textiles", (255, 160, 122)),
    ("home-decor", "Home Décor", (221, 160, 221)),
    ("accessories", "Accessories", (152, 251, 152)),
    ("gifts-souvenirs", "Gifts & Souvenirs", (255, 182, 193))
]

for slug, name, color in categories:
    create_image_placeholder(
        f"public/images/categories/cat-{slug}.jpg",
        400, 300,
        name,
        color
    )

# Create artisan images
artisans = [
    ("sarla", "Sarla Bai\\nPachmarhi", (255, 218, 185)),
    ("ramesh", "Ramesh Uikey\\nTamia", (222, 184, 135)),
    ("meera", "Meera Gond\\nPipariya", (250, 240, 230))
]

for slug, name, color in artisans:
    create_image_placeholder(
        f"public/images/artisans/arti-{slug}.jpg",
        300, 400,
        name,
        color
    )

# Create product images
products = [
    "bamboo-wall-art",
    "handloom-sari", 
    "terracotta-necklace",
    "dokra-figurine",
    "tribal-printed-shirt",
    "cane-basket",
    "gond-painting",
    "brass-earrings"
]

for product in products:
    product_name = product.replace('-', ' ').title()
    for i in range(1, 4):
        create_image_placeholder(
            f"public/images/products/{product}/img{i}.jpg",
            500, 500,
            f"{product_name}\\nImage {i}",
            (240, 230, 220)
        )

# Create returns image
create_image_placeholder(
    "public/images/returns/sample1.jpg",
    400, 300,
    "Return Sample\\nDefective Product",
    (255, 200, 200)
)

print("All placeholder images created!")