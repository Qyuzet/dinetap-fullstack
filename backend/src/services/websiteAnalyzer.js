const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

class WebsiteAnalyzer {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Extract colors from website using multiple methods
  async extractWebsiteColors(websiteUrl) {
    try {
      console.log(`Extracting colors from website: ${websiteUrl}`);

      // Method 1: Try with Puppeteer (most accurate)
      try {
        const puppeteerColors = await this.extractColorsWithPuppeteer(websiteUrl);
        if (puppeteerColors && puppeteerColors.length > 0) {
          console.log('Successfully extracted colors with Puppeteer');
          return this.processExtractedColors(puppeteerColors);
        }
      } catch (puppeteerError) {
        console.log('Puppeteer extraction failed, trying fallback method');
      }

      // Method 2: Fallback to HTML parsing
      try {
        const htmlColors = await this.extractColorsFromHTML(websiteUrl);
        if (htmlColors && htmlColors.length > 0) {
          console.log('Successfully extracted colors from HTML');
          return this.processExtractedColors(htmlColors);
        }
      } catch (htmlError) {
        console.log('HTML extraction failed');
      }

      // Method 3: Last resort - analyze domain for brand colors
      return this.generateBrandBasedColors(websiteUrl);

    } catch (error) {
      console.error('Error extracting website colors:', error);
      return null;
    }
  }

  // Extract colors using Puppeteer (most accurate)
  async extractColorsWithPuppeteer(websiteUrl) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      // Navigate to the website
      await page.goto(websiteUrl, { 
        waitUntil: 'networkidle0', 
        timeout: 10000 
      });

      // Extract colors from computed styles
      const colors = await page.evaluate(() => {
        const extractedColors = new Set();
        
        // Get all elements
        const elements = document.querySelectorAll('*');
        
        for (let element of elements) {
          const computedStyle = window.getComputedStyle(element);
          
          // Extract background colors
          const bgColor = computedStyle.backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            extractedColors.add(bgColor);
          }
          
          // Extract text colors
          const textColor = computedStyle.color;
          if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
            extractedColors.add(textColor);
          }
          
          // Extract border colors
          const borderColor = computedStyle.borderColor;
          if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
            extractedColors.add(borderColor);
          }
        }
        
        return Array.from(extractedColors);
      });

      return colors;

    } finally {
      await page.close();
    }
  }

  // Extract colors from HTML/CSS (fallback method)
  async extractColorsFromHTML(websiteUrl) {
    try {
      const response = await axios.get(websiteUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const colors = new Set();

      // Extract colors from inline styles
      $('[style]').each((i, element) => {
        const style = $(element).attr('style');
        const colorMatches = style.match(/(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\))/g);
        if (colorMatches) {
          colorMatches.forEach(color => colors.add(color));
        }
      });

      // Extract colors from CSS
      $('style').each((i, element) => {
        const cssText = $(element).text();
        const colorMatches = cssText.match(/(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\))/g);
        if (colorMatches) {
          colorMatches.forEach(color => colors.add(color));
        }
      });

      return Array.from(colors);

    } catch (error) {
      console.error('Error extracting colors from HTML:', error);
      return [];
    }
  }

  // Process extracted colors and select the best ones
  processExtractedColors(rawColors) {
    // Convert all colors to hex format
    const hexColors = rawColors
      .map(color => this.convertToHex(color))
      .filter(color => color && color !== '#000000' && color !== '#ffffff')
      .filter((color, index, arr) => arr.indexOf(color) === index); // Remove duplicates

    if (hexColors.length === 0) {
      return null;
    }

    // Analyze colors and select primary, secondary, accent
    const colorAnalysis = this.analyzeColors(hexColors);
    
    return {
      primary: colorAnalysis.primary,
      secondary: colorAnalysis.secondary,
      accent: colorAnalysis.accent,
      extractedColors: hexColors.slice(0, 10), // Keep top 10 for reference
      source: 'website_extraction'
    };
  }

  // Convert various color formats to hex
  convertToHex(color) {
    if (!color) return null;

    // Already hex
    if (color.startsWith('#')) {
      return color.length === 4 ? 
        '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] : 
        color;
    }

    // RGB/RGBA to hex
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    return null;
  }

  // Analyze extracted colors and select the best primary, secondary, accent
  analyzeColors(hexColors) {
    // Sort colors by frequency and visual impact
    const colorScores = hexColors.map(color => ({
      color,
      score: this.calculateColorScore(color)
    })).sort((a, b) => b.score - a.score);

    const primary = colorScores[0]?.color || '#1F2937';
    
    // Find a good secondary color (darker or complementary)
    const secondary = this.findSecondaryColor(primary, colorScores) || this.darkenColor(primary);
    
    // Find a good accent color (lighter or complementary)
    const accent = this.findAccentColor(primary, colorScores) || this.lightenColor(primary);

    return { primary, secondary, accent };
  }

  // Calculate color score based on visual impact and suitability for restaurants
  calculateColorScore(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return 0;

    let score = 0;

    // Prefer colors that are not too dark or too light
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    if (brightness > 50 && brightness < 200) score += 20;

    // Prefer colors with good saturation
    const saturation = this.calculateSaturation(rgb);
    if (saturation > 0.3 && saturation < 0.8) score += 15;

    // Bonus for restaurant-friendly colors (reds, oranges, browns, greens)
    const hue = this.calculateHue(rgb);
    if ((hue >= 0 && hue <= 30) || (hue >= 330 && hue <= 360)) score += 10; // Reds
    if (hue >= 15 && hue <= 45) score += 8; // Oranges
    if (hue >= 20 && hue <= 60) score += 6; // Browns/Yellows
    if (hue >= 90 && hue <= 150) score += 7; // Greens

    return score;
  }

  // Helper functions for color manipulation
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  calculateSaturation(rgb) {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    return max === 0 ? 0 : (max - min) / max;
  }

  calculateHue(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff === 0) return 0;
    
    let hue;
    if (max === r) hue = ((g - b) / diff) % 6;
    else if (max === g) hue = (b - r) / diff + 2;
    else hue = (r - g) / diff + 4;
    
    return Math.round(hue * 60);
  }

  findSecondaryColor(primary, colorScores) {
    const primaryRgb = this.hexToRgb(primary);
    if (!primaryRgb) return null;

    // Find a color that's darker or has good contrast
    for (let colorData of colorScores.slice(1)) {
      const rgb = this.hexToRgb(colorData.color);
      if (rgb) {
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const primaryBrightness = (primaryRgb.r * 299 + primaryRgb.g * 587 + primaryRgb.b * 114) / 1000;
        
        if (brightness < primaryBrightness - 30) {
          return colorData.color;
        }
      }
    }
    return null;
  }

  findAccentColor(primary, colorScores) {
    const primaryRgb = this.hexToRgb(primary);
    if (!primaryRgb) return null;

    // Find a color that's lighter or complementary
    for (let colorData of colorScores.slice(1)) {
      const rgb = this.hexToRgb(colorData.color);
      if (rgb) {
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const primaryBrightness = (primaryRgb.r * 299 + primaryRgb.g * 587 + primaryRgb.b * 114) / 1000;
        
        if (brightness > primaryBrightness + 50 && brightness > 180) {
          return colorData.color;
        }
      }
    }
    return null;
  }

  darkenColor(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return '#111827';
    
    const factor = 0.7;
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  lightenColor(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return '#F9FAFB';
    
    const factor = 0.9;
    const r = Math.round(rgb.r + (255 - rgb.r) * factor);
    const g = Math.round(rgb.g + (255 - rgb.g) * factor);
    const b = Math.round(rgb.b + (255 - rgb.b) * factor);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Generate brand-based colors as last resort
  generateBrandBasedColors(websiteUrl) {
    console.log('Using brand-based color generation as fallback');
    
    // Extract domain for brand analysis
    const domain = new URL(websiteUrl).hostname.toLowerCase();
    
    // Known brand colors for popular domains
    const brandColors = {
      'mcdonalds.com': { primary: '#FFC72C', secondary: '#DA020E', accent: '#FFF5B7' },
      'starbucks.com': { primary: '#00704A', secondary: '#1E3932', accent: '#F1F8F6' },
      'subway.com': { primary: '#009639', secondary: '#00471B', accent: '#F2F8F4' },
      'pizzahut.com': { primary: '#EE3124', secondary: '#B91C1C', accent: '#FEF2F2' },
      'dominos.com': { primary: '#0078AE', secondary: '#1E40AF', accent: '#EFF6FF' },
      'kfc.com': { primary: '#F40027', secondary: '#B91C1C', accent: '#FEF2F2' },
      'tacobell.com': { primary: '#702F8A', secondary: '#5B21B6', accent: '#F5F3FF' },
      'chipotle.com': { primary: '#A81612', secondary: '#7F1D1D', accent: '#FEF2F2' },
      'panera.com': { primary: '#6BA04A', secondary: '#15803D', accent: '#F0FDF4' },
      'olivegarden.com': { primary: '#4A5D23', secondary: '#365314', accent: '#F7FEE7' }
    };

    if (brandColors[domain]) {
      console.log(`Using known brand colors for ${domain}`);
      return {
        ...brandColors[domain],
        source: 'brand_database'
      };
    }

    return null;
  }
}

module.exports = WebsiteAnalyzer;
