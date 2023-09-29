'use client';

import Image from 'next/image';
import { useTransition, useState } from 'react';
import { useSession } from 'next-auth/react';

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
import { addSong } from '@/app/actions';
import type { SongInsert } from '@/db/schema';

type AddButtonProps = {
    name: SearchResult['name'];
    artists: SearchResult['artists'];
    imageURL: SearchResult['album']['images'][0]['url'];
    id: SearchResult['id'];
};

export function AddButton({ name, artists, imageURL, id }: AddButtonProps) {
    const session = useSession();

    const [isPending, startTransition] = useTransition();

    const [acoustic, setAcoustic] = useState(false);
    const [tuning, setTuning] = useState(false);
    const [feminine, setFemine] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const payload: SongInsert = {
        spotifyId: id,
        spotifyImage: imageURL,
        accountName: session.data?.user?.name,
        name: name,
        artist: artists.map((i) => i.name).join(', '),
        acoustic: acoustic,
        tuning: tuning,
        feminine: feminine
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                                    <Switch
                                        id="acoustic"
                                        checked={acoustic}
                                        onCheckedChange={() => setAcoustic(!acoustic)}
                                    />
                                    <Label htmlFor="acoustic" className="flex gap-2 py-2">
                                        <span>Acoustic compatible?</span>
                                        <span>🎻</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 ">
                                    <Switch
                                        id="drop-tuning"
                                        checked={tuning}
                                        onCheckedChange={() => setTuning(!tuning)}
                                    />
                                    <Label htmlFor="drop-tuning" className="flex gap-2 py-2">
                                        <span>Needs drop tuning?</span>
                                        <span>🤘</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 ">
                                    <Switch
                                        id="feminine"
                                        checked={feminine}
                                        onCheckedChange={() => setFemine(!feminine)}
                                    />
                                    <Label htmlFor="feminine" className="flex gap-2 py-2">
                                        <span>Female compatible voice?</span>
                                        <span>🎤</span>
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() =>
                        startTransition(async () => {
                            const response = await addSong(payload);
                            if (response.error) {
                                console.log(response.error);
                            }
                            setDialogOpen(false);
                        })
                    }
                    disabled={isPending}
                >
                    {isPending ? 'Saving...' : 'Save song'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
