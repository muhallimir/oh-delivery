// Web-only mock sanity client - replaces the real sanity client on web builds
// This avoids CORS issues and Node.js dependency problems

const mockClient = {
  fetch: async (query) => {
    console.log('Mock sanity fetch called with:', query);
    // Return empty array to trigger mock data fallback
    return [];
  },
};

const mockBuilder = {
  image: (source) => {
    if (!source) return null;
    return {
      url: () => source.asset?._ref 
        ? `https://picsum.photos/seed/${source.asset._ref}/400/300`
        : 'https://picsum.photos/400/300',
      width: 400,
      height: 300,
    };
  },
};

export const urlFor = (source) => mockBuilder.image(source);
export default mockClient;