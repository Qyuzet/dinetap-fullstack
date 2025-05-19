// Script to download fallback images from Unsplash
const https = require("https");
const fs = require("fs");
const path = require("path");

// Create the fallback directory if it doesn't exist
const fallbackDir = path.join(__dirname, "../public/images/fallback");
if (!fs.existsSync(fallbackDir)) {
  fs.mkdirSync(fallbackDir, { recursive: true });
}

// List of image URLs and their target filenames
const images = [
  {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    filename: "salad.jpg",
    category: "Salad",
  },
  {
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    filename: "default-food.jpg",
    category: "Default Food",
  },
  {
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    filename: "pizza.jpg",
    category: "Pizza",
  },
  {
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    filename: "burger.jpg",
    category: "Burger",
  },
  {
    url: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b",
    filename: "steak.jpg",
    category: "Steak",
  },
  {
    url: "https://images.unsplash.com/photo-1562967914-608f82629710",
    filename: "chicken.jpg",
    category: "Chicken",
  },
  {
    url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    filename: "pasta.jpg",
    category: "Pasta",
  },
  {
    url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
    filename: "dessert.jpg",
    category: "Dessert",
  },
  {
    url: "https://images.unsplash.com/photo-1547592180-85f173990554",
    filename: "soup.jpg",
    category: "Soup",
  },
  {
    url: "https://images.unsplash.com/photo-1534939561126-855b8675edd7",
    filename: "seafood.jpg",
    category: "Seafood",
  },
  {
    url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
    filename: "appetizer.jpg",
    category: "Appetizer",
  },
  {
    url: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    filename: "rice.jpg",
    category: "Rice",
  },
  {
    url: "https://images.unsplash.com/photo-1544145945-f90425340c7e",
    filename: "beverage.jpg",
    category: "Beverage",
  },
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    // Add Unsplash parameters for a smaller image size
    const fullUrl = `${url}?auto=format&fit=crop&w=600&q=80`;

    https
      .get(fullUrl, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          downloadImage(response.headers.location, filename)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const filePath = path.join(fallbackDir, filename);
        const fileStream = fs.createWriteStream(filePath);

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });

        fileStream.on("error", (err) => {
          fs.unlink(filePath, () => {}); // Delete the file if there's an error
          reject(err);
        });
      })
      .on("error", reject);
  });
}

// Download all images
async function downloadAllImages() {
  console.log("Starting download of fallback images...");

  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error.message);
    }
  }

  console.log("All downloads completed!");
}

downloadAllImages();
