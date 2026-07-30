while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  if [[ -z "$line" ]] || [[ "$line" == \#* ]]; then
    continue
  fi
  
  if [[ "$line" == *=* ]]; then
    key=$(echo "$line" | cut -d= -f1)
    val=$(echo "$line" | cut -d= -f2-)
    
    # Push to production, preview, and development
    echo "Pushing $key..."
    echo -n "$val" | npx vercel env add $key production
    echo -n "$val" | npx vercel env add $key preview
    echo -n "$val" | npx vercel env add $key development
  fi
done < .env.local
