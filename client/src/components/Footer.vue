<template>
  <footer class="amazon-footer">
    <div class="back-to-top">
      <a href="#" @click.prevent="scrollToTop">Back to top</a>
    </div>

    <div class="footer-content">
      <div class="footer-section">
        <h3>Get to Know Us</h3>
        <ul>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">About Amazon</a></li>
          <li><a href="#">Investor Relations</a></li>
          <li><a href="#">Amazon Devices</a></li>
          <li><a href="#">Amazon Science</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Make Money with Us</h3>
        <ul>
          <li><a href="#">Sell products on Amazon</a></li>
          <li><a href="#">Sell on Amazon Business</a></li>
          <li><a href="#">Sell apps on Amazon</a></li>
          <li><a href="#">Become an Affiliate</a></li>
          <li><a href="#">Advertise Your Products</a></li>
          <li><a href="#">Self-Publish with Us</a></li>
          <li><a href="#">Host an Amazon Hub</a></li>
          <li><a href="#">› See More Make Money with Us</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Amazon Payment Products</h3>
        <ul>
          <li><a href="#">Amazon Business Card</a></li>
          <li><a href="#">Shop with Points</a></li>
          <li><a href="#">Reload Your Balance</a></li>
          <li><a href="#">Amazon Currency Converter</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Let Us Help You</h3>
        <ul>
          <li><a href="#">Amazon and COVID-19</a></li>
          <li><a href="#">Your Account</a></li>
          <li><a href="#">Your Orders</a></li>
          <li><a href="#">Shipping Rates & Policies</a></li>
          <li><a href="#">Returns & Replacements</a></li>
          <li><a href="#">Manage Your Content and Devices</a></li>
          <li><a href="#">Amazon Assistant</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-line"></div>

    <div class="footer-bottom">
      <div class="footer-logo">
        <span class="logo-icon">▷</span>
        <span class="logo-text">ama<span class="logo-highlight">shop</span></span>
      </div>
      <div class="footer-links">
        <a href="#">Conditions of Use</a>
        <a href="#">Privacy Notice</a>
        <a href="#">Your Ads Privacy Choices</a>
      </div>
      <div class="footer-copyright">
        © {{ currentYear }}, AmaShop, Inc. or its affiliates
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.amazon-footer {
  background: #131921;
  color: #fff;
  font-family: 'Amazon Ember', Arial, sans-serif;
}

.back-to-top {
  background: #37475a;
  text-align: center;
  padding: 15px;
}

.back-to-top a {
  color: #fff;
  text-decoration: none;
  font-size: 13px;
}

.back-to-top a:hover {
  text-decoration: underline;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1500px;
  margin: 0 auto;
  padding: 50px 40px;
  gap: 40px;
}

.footer-section {
  flex: 1;
  min-width: 180px;
}

.footer-section h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #ddd;
  text-decoration: none;
  font-size: 13px;
}

.footer-section a:hover {
  text-decoration: underline;
}

.footer-line {
  border-top: 1px solid #3a4553;
  margin: 0 40px;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 30px;
  text-align: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 20px;
  color: #fff;
  margin-right: 2px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

.logo-highlight {
  color: #FF9900;
}

.footer-links {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.footer-links a {
  color: #ddd;
  text-decoration: none;
  font-size: 12px;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-copyright {
  color: #ddd;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .footer-content {
    flex-wrap: wrap;
    gap: 30px;
  }
  
  .footer-section {
    min-width: 150px;
    flex: 0 0 45%;
  }
}

@media (max-width: 600px) {
  .footer-section {
    flex: 0 0 100%;
  }
}
</style>
