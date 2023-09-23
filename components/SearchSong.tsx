'use client';

import { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchResult from './SearchResult';

export function SearchSong() {
    const [results, setResults] = useState([]);

    const formSchema = z.object({
        songname: z.string().min(1, {
            message: 'Search term must be at least 1 character long.'
        })
    });

    type Schema = z.infer<typeof formSchema>;

    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            songname: ''
        }
    });

    const fetchResults = async (query: Schema['songname']) => {
        const req = await fetch(`api/spotify/searchSong`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ search: query })
        });
        const data = await req.json();

        if (data) {
            setResults(data.tracks.items);
        }
    };

    const onSubmit = (data: Schema) => {
        fetchResults(data.songname);
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex py-5 gap-5">
                    <FormField
                        control={form.control}
                        name="songname"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 flex-grow">
                                <FormLabel>Spotify</FormLabel>
                                <FormControl className="">
                                    <Input placeholder="Type your song..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <SearchResult data={results} />
        </div>
    );
}
