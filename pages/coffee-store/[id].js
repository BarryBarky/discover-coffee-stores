import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Link from "next/link";

import styles from "../../styles/Coffee-store.module.css"

import coffeeStoresData from "../../data/coffee-stores.json"
import Head from "next/head";
import Image from "next/image";
import {fetchCoffeeStores} from "../../lib/coffee-stores";
import {StoreContext} from "../../store/store-context";
import {isEmpty} from "../../utils";
import useSWR from "swr";
import {fetcher} from "../../fetchers/fetch";
import {error} from "next/dist/build/output/log";

const CoffeeStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {})

    const [votingCount, setVotingCount] = useState(0)

    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

    useEffect(() => {
        if (data && data.length > 0){
            setCoffeeStore(data[0])
            setVotingCount(data[0].voting)
        }
    }, [data])


    const {
        state: {
            coffeeStores
        },
    } = useContext(StoreContext)

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {id, name, imgUrl, neighborhood, address} = coffeeStore;

            const response = await fetch('/api/createCoffeeStore', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name,
                    voting: 0,
                    imgUrl,
                    neighborhood: neighborhood || "",
                    address: address || ""
                }),
            })
        } catch (error) {
            console.error('Error creating coffeestore', error)
        }
    }

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find(coffeeStore => {
                    return coffeeStore.id.toString() === id
                });
                if (coffeeStoreFromContext){
                    setCoffeeStore(coffeeStoreFromContext)
                    handleCreateCoffeeStore(coffeeStoreFromContext)
                }

            }
        } else {
            // SSG
            handleCreateCoffeeStore(initialProps.coffeeStore)
        }
    }, [id, initialProps, initialProps.coffeeStore, coffeeStores])

    if (router.isFallback) {
        return <div>Loading..</div>
    }


    const {address, neighborhood, name, imgUrl} = coffeeStore;

    const handleUpvoteButton = async () => {
        try {
            const response = await fetch('/api/favouriteCoffeeStoreById', {
                method: 'PUT', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                }),
            })
            const dbCoffeeStore = response.json();
            if (dbCoffeeStore && dbCoffeeStore.length > 0){
                let count = votingCount + 1;
                setVotingCount(count)
            }

        } catch (error) {
            console.error('Error upvoting', error)
        }
    }

    if (error){
        return <div>Something went wrong retrieving coffee store page</div>
    }

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a>← Back to Home</a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image
                        src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                        width={600} height={300} className={styles.storeIMG} alt={name}/>
                </div>
                <div className={"glass " + styles.col2}>
                    {address && (
                        <div className={styles.iconWrapper}>
                            <Image src={"/static/icons/places.svg"} width={24} height={24}/>
                            <p className={styles.text}>{address}</p>
                        </div>
                    )}
                    {neighborhood && (
                        <div className={styles.iconWrapper}>
                            <Image src={"/static/icons/nearMe.svg"} width={24} height={24}/>
                            <p className={styles.text}>{neighborhood}</p>
                        </div>
                    )}
                    <div className={styles.iconWrapper}>
                        <Image src={"/static/icons/star.svg"} width={24} height={24}/>
                        <p className={styles.text}>{votingCount}</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote!</button>
                </div>
            </div>
        </div>
    );
};

export async function getStaticProps(context) {
    const params = context.params;
    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStores.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id
    });
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
        }
    }
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map(coffeeStore => {
        return {
            params: {
                id: coffeeStore.id.toString()
            }
        }
    })
    return {
        paths,
        fallback: true, // can also be true or 'blocking'
    }
}

export default CoffeeStore;