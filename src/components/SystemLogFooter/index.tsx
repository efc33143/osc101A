'use client'

import styles from './SystemLogFooter.module.css'

export default function SystemLogFooter() {
    return (
        <footer className={styles.systemLog}>
            <h3 className={styles.logTitle}>&gt; SYSTEM LOG: ABOUT THE SIGNAL</h3>
            <p className={styles.logText}>
                OSC101 is an independent project and the primary source for Underground House, Raw Electro, and Atmospheric Trip Hop. Using the Cassetto music app, we provide a direct line from the studio to the listener, bypassing mainstream algorithms to deliver original Electronic Music Transmissions through a custom audio platform.
            </p>
            <p className={styles.logText}>
                Built on a three-decade legacy in the Florida Underground scene, our sound spans the 4/4 Tribal House roots of DIM CONCEPT to the Heavy Breakbeats and Downtempo Lounge textures of OSC101. We feature resident projects alongside guest collaborations from like-minded Independent Artists.
            </p>
        </footer>
    )
}
