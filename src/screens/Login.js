import React, { useState } from 'react'
import { Button, View, Text } from 'react-native'

import auth from '@react-native-firebase/auth'

export const LoginScreen = () => {
    const [ confirm, setConfirm ] = useState()

    const onClickSendMessage = async () => {
        const confirmation = await auth().signInWithPhoneNumber('+97699999999')
        setConfirm(confirmation)
    }

    const onConfirm = async () => {
        try {
            await confirm.confirm('111111')
        } catch (e) {
            console.error(e.message)
        }
    }

    return (
        <View>
            <Text>Login screen</Text>
            <Button title="Send message" onPress={ onClickSendMessage } />
            <Button title="Confirm" onPress={ onConfirm } />
        </View>
    )
}
