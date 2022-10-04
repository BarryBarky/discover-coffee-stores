import {createApi} from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, category, limit) => {
    return `https://api.foursquare.com/v3/places/search?ll=${latLong}&radius=22000&categories=${category}&limit=${limit}`
}

const getListOfCoffeeStoresPhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: "coffee shop",
        perPage: 40,
    });
    const unsplashResults = photos.response.results;
    return unsplashResults.map(result => result.urls["small"]);
}

export const fetchCoffeeStores = async (latLong = '43.64944337648408%2C-79.3810872380855', limit = 6) => {
    const photos = await getListOfCoffeeStoresPhotos();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(getUrlForCoffeeStores(latLong, 13035, limit), options);
    const data = await response.json()
    return data.results
    .map((result, index) => {
        const neighborhood = result.location.neighborhood
        return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            neighborhood: neighborhood && neighborhood.length > 0 ? neighborhood[0] : "",
            imgUrl: photos.length > 0 ? photos[index] : null
        }
    });
}