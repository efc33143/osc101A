'use client'

import styles from './SystemLogFooter.module.css'

export default function SystemLogFooter() {
    return (
        <footer className={styles.systemLog}>
            <h3 className={styles.logTitle}>&gt; SYSTEM LOG: ABOUT THE SIGNAL</h3>
            <p className={styles.logText}>
                OSC101 is an independent project dedicated to the deeper side of electronic music. We focus on underground House, raw Electro, and atmospheric Trip Hop—the kind of tracks that usually get lost in the noise of big streaming platforms and corporate algorithms.
            </p>
            <p className={styles.logText}>
                Instead of chasing trends, we curate a specific sound for a community that values craft over clout. Whether it’s heavy Breakbeats or experimental soundscapes, everything here is selected because it has soul and a story. This is a direct line between the artist and the listener, keeping the focus on the music and the people who make it.
            </p>
        </footer>
    )
}
