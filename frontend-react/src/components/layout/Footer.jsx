'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { APP_VERSION } from '../../services/Common';
import DataService from "../../services/DataService";

import styles from './Footer.module.css';

export default function Footer() {

    // State
    const pathname = usePathname();
    const hideFooter = pathname === '/chat';
    const [version, setVersion] = useState(null);
    const loadStatus = () => {
        DataService.GetStatus()
            .then(function (response) {
                setVersion(response.data["version"]);
            });
    }

    // Setup Component
    useEffect(() => {
        loadStatus();
    }, []);

    if (hideFooter) {
        return (
            <></>
        )
    } else {
        return (
            <footer className={styles.footer}>
                <p>Copyright © {new Date().getFullYear()} formaggio.me - All Rights Reserved. &nbsp; &nbsp; &nbsp; &nbsp;
                    <span>Frontend version: {APP_VERSION}</span> &nbsp; &nbsp; &nbsp;<span>API version: {version}</span></p>
            </footer>
        );
    }

}