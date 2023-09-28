import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { type SearchResult } from '@/types/searchResult';

type AddButtonProps = {
    name: SearchResult['name'];
    artists: SearchResult['artists'];
    imageURL: SearchResult['album']['images'][0]['url'];
    id: SearchResult['id'];
};

export function AddButton({ name, artists, imageURL }: AddButtonProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Suggest song</DialogTitle>
                    <DialogDescription>
                        Make sure to fill in the correct information
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <div className="h-72 w-72 flex-shrink-0">
                            <Image src={imageURL} alt={name} height={300} width={300} unoptimized />
                        </div>
                        <div className="flex flex-col gap-4 justify-center">
                            <div className="flex flex-col gap-4 justify-center flex-grow">
                                <span className="text-2xl font-bold line-clamp-3">{name}</span>
                                <span className="">{artists.map((i) => i.name).join(', ')}</span>
                            </div>
                            <div className="flex flex-col gap-4 justify-center">
                                <div className="flex items-center space-x-2 ">
                                    <Switch id="acoustic" />
                                    <Label htmlFor="acoustic" className="flex gap-2 py-2">
                                        <span>Acoustic compatible?</span>
                                        <span>🎻</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 ">
                                    <Switch id="drop-tuning" />
                                    <Label htmlFor="drop-tuning" className="flex gap-2 py-2">
                                        <span>Needs drop tuning?</span>
                                        <span>🤘</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 ">
                                    <Switch id="feminine" />
                                    <Label htmlFor="feminine" className="flex gap-2 py-2">
                                        <span>Female compatible voice?</span>
                                        <span>🎤</span>
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button>Save song</Button>
            </DialogContent>
        </Dialog>
    );
}
