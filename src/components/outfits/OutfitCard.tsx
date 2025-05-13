import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface OutfitCardProps {
  name: string;
  imageUrl: string;
  id: string;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ name, imageUrl, id }) => {
  const encodedImageUrl = encodeURIComponent(imageUrl);
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] relative w-full">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="dress fashion clothing"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/customize?outfitUrl=${encodedImageUrl}&outfitName=${encodeURIComponent(name)}`} passHref legacyBehavior>
          <Button className="w-full" aria-label={`Customize ${name}`}>
            <Eye className="mr-2 h-4 w-4" /> Customize
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OutfitCard;
