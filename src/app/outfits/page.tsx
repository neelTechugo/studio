import OutfitCard from '@/components/outfits/OutfitCard';

interface Outfit {
  id: string;
  name: string;
  imageUrl: string;
}

const outfits: Outfit[] = [
  { id: '1', name: 'Classic Blue Dress', imageUrl: 'https://picsum.photos/seed/dress1/400/600' },
  { id: '2', name: 'Elegant Red Gown', imageUrl: 'https://picsum.photos/seed/dress2/400/600' },
  { id: '3', name: 'Summer Floral Frock', imageUrl: 'https://picsum.photos/seed/dress3/400/600' },
  { id: '4', name: 'Chic Black Jumpsuit', imageUrl: 'https://picsum.photos/seed/jumpsuit1/400/600' },
  { id: '5', name: 'Bohemian Maxi Dress', imageUrl: 'https://picsum.photos/seed/maxidress/400/600' },
  { id: '6', name: 'Professional Blazer Set', imageUrl: 'https://picsum.photos/seed/blazerset/400/600' },
];

export default function OutfitSelectionPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Style</h1>
        <p className="mt-2 text-lg text-muted-foreground">Select an outfit to begin customizing your virtual look.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} {...outfit} />
        ))}
      </div>
    </div>
  );
}
