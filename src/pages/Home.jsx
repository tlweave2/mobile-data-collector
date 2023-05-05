import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../index';
import { signOut } from 'firebase/auth';
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { useAtom, useSetAtom } from 'jotai';
import { 
    pastSessionData, 
    appMode, 
    notificationText,
    currentSessionData,
    editingPrevious,
    pastEntryIndex,
    currentFormName,
    lizardLastEditTime
} from '../utils/jotai';
import { doc, getDoc } from 'firebase/firestore';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { deleteLizardEntries } from '../utils/functions';

export default function Home() {
    const [user, loading, error] = useAuthState(auth);
    const [pastSessions] = useAtom(pastSessionData);
    const [environment, setEnvironment] = useAtom(appMode);
    const setNotification = useSetAtom(notificationText);
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setIsEditingPrevious = useSetAtom(editingPrevious);
    const setPastEntryIndex = useSetAtom(pastEntryIndex);
    const [clearSessionConfirmationOpen, setClearSessionConfirmationOpen] = useState('')
    const setLastEditTime = useSetAtom(lizardLastEditTime);
    const setCurrentForm = useSetAtom(currentFormName);

    const clearCurrentSession = () => {
        setCurrentData({
            captureStatus: '',
            array: '',
            project: '',
            site: '',
            handler: '',
            recorder: '',
            arthropod: [],
            amphibian: [],
            lizard: [],
            mammal: [],
            snake: [],
        });
        deleteLizardEntries(currentData, environment);
        setNotification('Current session cleared!')
        setIsEditingPrevious(false);
        setCurrentForm('');
        setClearSessionConfirmationOpen(false);
    }

    const clearSessionConfirmationVariant = {
        hidden: {
            y: '-100%',
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1
        },
        exit: {
            opacity: 0,
            y: '-100%',
            transition: {
                y: {
                    duration: .3
                },
                opacity: {
                    duration: .25
                }
            }
        }
    }

    return (
        <motion.div>
            <LayoutGroup>

            <motion.h1 className="text-xl">Hello, {user && user.displayName}!</motion.h1>
            <Button 
                prompt={"Logout"}
                clickHandler={() => signOut(auth)}
            />
            <Dropdown 
                placeholder={"App mode"}
                value={environment}
                setValue={setEnvironment}
                options={["test", "live"]}
                clickHandler={entry => {
                    setNotification(`App is now in ${entry} mode`)
                    setCurrentData({
                        captureStatus: '',
                        array: '',
                        project: '',
                        site: '',
                        handler: '',
                        recorder: '',
                        arthropod: [],
                        amphibian: [],
                        lizard: [],
                        mammal: [],
                        snake: [],
                    })
                    setIsEditingPrevious(false);
                    setPastEntryIndex(-1);
                }}
            />
            <Button 
                prompt='Clear current session data?'
                clickHandler={() => {
                    if (clearSessionConfirmationOpen) {
                        setClearSessionConfirmationOpen(false)
                    } else {
                        setClearSessionConfirmationOpen(true)
                    }
                }}
            />
            <AnimatePresence mode='popLayout'>
            {clearSessionConfirmationOpen && <motion.div
                variants={clearSessionConfirmationVariant}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex flex-row items-center justify-around'
            >   
                <Button 
                    prompt='Yes'
                    clickHandler={() => clearCurrentSession()}
                />
                <Button 
                    prompt='No'
                    clickHandler={() => setClearSessionConfirmationOpen(false)}
                />
            </motion.div>}
            </AnimatePresence>
            </LayoutGroup>
        </motion.div>
    );
}
