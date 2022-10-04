import React from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "/styles/Card.module.css"

const Card = (props) => {
    return (
        <Link href={props.href}>
            <a className={styles.cardLink}>
                <div className={styles.container + " glass"}>
                    <div className={styles.cardHeaderWrapper}>
                        <h2 className={styles.cardHeader}>{props.name}</h2>
                    </div>
                    <div className={styles.cardHeaderWrapper}>
                        <Image src={props.imgUrl} width={260} height={160} className={styles.cardImage}/>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default Card;