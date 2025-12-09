import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  products: Product[] = [
    { id: 1, name: 'Lenten Devotionals 2024', description: '40-day journey through Psalm 119', price: 15.99, category: 'Books' },
    { id: 2, name: 'ACFI T-Shirt', description: 'Premium cotton with church logo', price: 24.99, category: 'Apparel' },
    { id: 3, name: 'ACFI Coffee Mug', description: 'Ceramic mug with inspirational verse', price: 12.99, category: 'Gifts' },
    { id: 4, name: 'Bible Study Guide', description: 'Downloadable PDF resource', price: 9.99, category: 'Digital' },
    { id: 5, name: 'Wooden Cross Bookmark', description: 'Handcrafted gift item', price: 7.99, category: 'Gifts' },
    { id: 6, name: 'Study Bible (NIV)', description: 'Leather-bound with study notes', price: 49.99, category: 'Books' }
  ];

  cart: CartItem[] = [];
  cartOpen = false;

  ngOnInit() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('acfi-cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: number, change: number) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  saveCart() {
    localStorage.setItem('acfi-cart', JSON.stringify(this.cart));
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }
}
