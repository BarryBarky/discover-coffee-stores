import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from "../components/Banner";
import Card from "../components/Card";
import coffeeStoresData from "../data/coffee-stores.json"
import {fetchCoffeeStores} from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import {useContext, useEffect, useState} from "react";
import {ACTION_TYPES, StoreContext} from "../store/store-context";

export default function Home(props) {

    const {handleTrackLocation, locationErrorMessage, isFindingLocation} = useTrackLocation();

    const [coffeeStoresError, setCoffeeStoresError] = useState(null);

    const { dispatch, state } = useContext(StoreContext)

    const {coffeeStores, latLong} = state;

    useEffect(() => {
        const fetchNearByCoffeeStores = async () => {
            if (latLong) {
                try {
                    const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`)
                    const coffeeStores = await response.json();
                    //set coffee stores
                    // setCoffeeStores(fetchedCoffeeStores)
                    dispatch({
                        type: ACTION_TYPES.SET_COFFEE_STORES,
                        payload: {
                            coffeeStores
                        }
                    })
                    setCoffeeStoresError("")
                }
                catch(error) {
                    //set error
                    setCoffeeStoresError(error.message)
                }
            }
        }
        fetchNearByCoffeeStores();

    }, [latLong])

    const handleOnButtonClick = () => {
        handleTrackLocation();
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Coffee Connoisseur</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <Banner buttonText={isFindingLocation ? "locating..." : "View stores nearby"} handleOnClick={handleOnButtonClick}/>
                {locationErrorMessage && <p>Something went wrong: {locationErrorMessage}</p>}
                {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
                <div className={styles.heroImage}>
                    <Image src={'/static/hero-image.png'} width={700} height={400}/>
                </div>
                {coffeeStores.length > 0 &&
                    <div className={styles.sectionWrapper}>
                        <h2 className={styles.heading2}>Stores Near Me</h2>
                        <div className={styles.cardLayout}>
                            {coffeeStores.map((coffeeStore) => {
                                return (
                                    <Card
                                        key={coffeeStore.id}
                                        name={coffeeStore.name}
                                        imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                                        href={`/coffee-store/${coffeeStore.id}`}
                                        className={styles.card}
                                    />
                                );
                            })}
                        </div>
                    </div>
                }
                {props.coffeeStores.length > 0 &&
                    <div className={styles.sectionWrapper}>
                        <h2 className={styles.heading2}>Toronto Stores</h2>
                        <div className={styles.cardLayout}>
                            {props.coffeeStores.map((coffeeStore) => {
                                return (
                                    <Card
                                        key={coffeeStore.id}
                                        name={coffeeStore.name}
                                        imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                                        href={`/coffee-store/${coffeeStore.id}`}
                                        className={styles.card}
                                    />
                                );
                            })}
                        </div>
                    </div>
                }
            </main>
        </div>
    )
}

export async function getStaticProps(context) {
    const coffeeStores = await fetchCoffeeStores();

    return {
        props: {
            coffeeStores
        }, // will be passed to the page component as props
    }
}
