"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Grid,
} from "@mui/material";

interface Attraction {
    id: string;
    name: string;
    coverimage: string;
    detail: string;
}

export default function AttractionsList() {
    const [data, setData] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attractions`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <Typography>Loading attractions...</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {data.map((attraction) => (
                <Grid item key={attraction.id} xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                        <CardMedia
                            sx={{ height: 180 }}
                            image={attraction.coverimage || "/placeholder.jpg"}
                            title={attraction.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                                {attraction.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}>
                                {attraction.detail}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button href={`/attractions/${attraction.id}`} size="small" variant="contained" color="primary" sx={{ ml: 1 }}>
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
