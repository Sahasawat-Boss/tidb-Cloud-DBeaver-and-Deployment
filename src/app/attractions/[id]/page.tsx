"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Container,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
} from "@mui/material";

interface Attraction {
    id: string;
    name: string;
    coverimage: string;
    detail: string;
}

export default function Page() {
    const params = useParams();
    const [data, setData] = useState<Attraction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        setClientReady(true); // Ensures the component only hydrates after mount
    }, []);

    useEffect(() => {
        async function fetchData(attractionId: string) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attractions/${attractionId}/`, {
                    cache: "no-store", // Ensures fresh data each request
                });
                if (!res.ok) throw new Error("Failed to fetch data");
                const json = await res.json();
                setData(json[0] || null);
            } catch {
                setError("Error fetching attraction data.");
            } finally {
                setLoading(false);
            }
        }

        if (clientReady && params?.id) {
            fetchData(params.id as string);
        }
    }, [clientReady, params]);

    if (!clientReady) {
        return null; // Prevents hydration issues by avoiding SSR rendering
    }

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !data) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error || "Attraction not found."}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 2 }}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.name}
                    </Typography>
                </CardContent>
                <CardMedia
                    sx={{ height: 400 }}
                    image={data.coverimage || "/placeholder.jpg"}
                    title={data.name}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {data.detail}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
