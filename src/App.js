import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import auth from '@react-native-firebase/auth'

import { HomeScreen } from './screens'
import { LoginScreen } from './screens'

import { AuthContext } from './contexts'

const App = () => {
    const [ user, setUser ] = useState()
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setUser(user)
            setIsLoading(false)
        })
        return subscriber
    }, [])

    if (isLoading) {
        return <Text>Loading</Text>
    }

    return (
        <AuthContext.Provider value={{ user }}>
            {
                user ? (
                    <HomeScreen />
                ) : (
                    <LoginScreen />
                )
            }
        </AuthContext.Provider>
    )
}

export default App
