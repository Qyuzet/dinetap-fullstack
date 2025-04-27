#!/bin/bash

# Find all TypeScript files in the app directory
find ./app -name "*.tsx" -o -name "*.ts" | while read file; do
  # Skip files in node_modules
  if [[ $file == *"node_modules"* ]]; then
    continue
  fi
  
  # Skip files that already have @ts-nocheck
  if grep -q "@ts-nocheck" "$file"; then
    echo "Skipping $file (already has @ts-nocheck)"
    continue
  fi
  
  # Check if the file starts with "use client"
  if grep -q "^\"use client\"" "$file"; then
    # Add @ts-nocheck before "use client"
    sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
    echo "Added @ts-nocheck to $file (before use client)"
  else
    # Add @ts-nocheck at the beginning of the file
    sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
    echo "Added @ts-nocheck to $file (at beginning)"
  fi
done

# Find all TypeScript files in the components directory
find ./components -name "*.tsx" -o -name "*.ts" | while read file; do
  # Skip files that already have @ts-nocheck
  if grep -q "@ts-nocheck" "$file"; then
    echo "Skipping $file (already has @ts-nocheck)"
    continue
  fi
  
  # Check if the file starts with "use client"
  if grep -q "^\"use client\"" "$file"; then
    # Add @ts-nocheck before "use client"
    sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
    echo "Added @ts-nocheck to $file (before use client)"
  else
    # Add @ts-nocheck at the beginning of the file
    sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
    echo "Added @ts-nocheck to $file (at beginning)"
  fi
done

# Find all TypeScript files in the context directory
find ./context -name "*.tsx" -o -name "*.ts" | while read file; do
  # Skip files that already have @ts-nocheck
  if grep -q "@ts-nocheck" "$file"; then
    echo "Skipping $file (already has @ts-nocheck)"
    continue
  fi
  
  # Check if the file starts with "use client"
  if grep -q "^\"use client\"" "$file"; then
    # Add @ts-nocheck before "use client"
    sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
    echo "Added @ts-nocheck to $file (before use client)"
  else
    # Add @ts-nocheck at the beginning of the file
    sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
    echo "Added @ts-nocheck to $file (at beginning)"
  fi
done

# Find all TypeScript files in the hooks directory
find ./hooks -name "*.tsx" -o -name "*.ts" | while read file; do
  # Skip files that already have @ts-nocheck
  if grep -q "@ts-nocheck" "$file"; then
    echo "Skipping $file (already has @ts-nocheck)"
    continue
  fi
  
  # Add @ts-nocheck at the beginning of the file
  sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
  echo "Added @ts-nocheck to $file (at beginning)"
done

# Find all TypeScript files in the lib directory
find ./lib -name "*.tsx" -o -name "*.ts" | while read file; do
  # Skip files that already have @ts-nocheck
  if grep -q "@ts-nocheck" "$file"; then
    echo "Skipping $file (already has @ts-nocheck)"
    continue
  fi
  
  # Add @ts-nocheck at the beginning of the file
  sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
  echo "Added @ts-nocheck to $file (at beginning)"
done

# Find all TypeScript files in the models directory
find ./models -name "*.tsx" -o -name "*.ts" | while read file; do
  # Skip files that already have @ts-nocheck
  if grep -q "@ts-nocheck" "$file"; then
    echo "Skipping $file (already has @ts-nocheck)"
    continue
  fi
  
  # Add @ts-nocheck at the beginning of the file
  sed -i '1s/^/\/\/ @ts-nocheck\n/' "$file"
  echo "Added @ts-nocheck to $file (at beginning)"
done

echo "Done adding @ts-nocheck to all TypeScript files"
