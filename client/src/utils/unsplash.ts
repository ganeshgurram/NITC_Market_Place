// Mock unsplash function to simulate the unsplash_tool functionality
export async function unsplash_tool({ query }: { query: string }): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a relevant Unsplash image based on the query
  const imageMap: Record<string, string> = {
    "textbook study book": "https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop",
    "laboratory equipment science": "https://images.unsplash.com/photo-1758876569703-ea9b21463691?w=400&h=400&fit=crop",
    "stationery supplies pens": "https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=400&h=400&fit=crop",
    "electronics gadgets technology": "https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop",
    "education supplies": "https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=400&h=400&fit=crop"
  };
  
  return imageMap[query] || "https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop";
}